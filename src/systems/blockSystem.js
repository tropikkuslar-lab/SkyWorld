/**
 * SkyWorld - Blok Sistemi
 * @author MiniMax Agent
 * @version 2.0
 */

import { BLOCK_TYPES, BLOCK_PROPERTIES } from '../constants/blocks.js';
import { CHUNK_SIZE, WORLD_HEIGHT } from '../constants/world.js';

export class BlockSystem {
    constructor() {
        this.chunks = new Map();
        this.chunkManager = new ChunkManager();
        this.blockGeometry = null;
        this.blockMaterials = {};
    }

    init(scene) {
        this.scene = scene;
        this.setupBlockGeometry();
        this.setupBlockMaterials();
        this.generateTerrain();
    }

    setupBlockGeometry() {
        // Küp geometri (tüm bloklar için aynı)
        this.blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    }

    setupBlockMaterials() {
        // Her blok tipi için materyal oluştur
        Object.keys(BLOCK_TYPES).forEach(blockType => {
            const color = BLOCK_TYPES[blockType].color;
            this.blockMaterials[blockType] = new THREE.MeshLambertMaterial({
                color: color,
                transparent: BLOCK_TYPES[blockType].transparent || false,
                opacity: BLOCK_TYPES[blockType].opacity || 1.0
            });
        });
    }

    generateTerrain() {
        // Basit düz arazi oluştur
        const chunkX = 0;
        const chunkZ = 0;
        const chunk = new Chunk(chunkX, chunkZ, CHUNK_SIZE);
        
        // Yükseklik haritası oluştur (basit)
        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let z = 0; z < CHUNK_SIZE; z++) {
                // Basit yükseklik hesabı
                const height = Math.floor(30 + Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5);
                
                for (let y = 0; y <= height; y++) {
                    let blockType = BLOCK_TYPES.AIR;
                    
                    if (y === height && height > 30) {
                        blockType = BLOCK_TYPES.GRASS;
                    } else if (y >= height - 3 && y < height) {
                        blockType = BLOCK_TYPES.DIRT;
                    } else {
                        blockType = BLOCK_TYPES.STONE;
                    }
                    
                    chunk.setBlock(x, y, z, blockType);
                }
            }
        }
        
        this.chunks.set(`${chunkX},${chunkZ}`, chunk);
        this.updateChunkMesh(chunk);
    }

    updateChunkMesh(chunk) {
        // Chunk mesh'ini güncelle
        const meshGroup = this.chunkManager.buildChunkMesh(chunk, this.blockGeometry, this.blockMaterials);
        
        // Eski mesh'i kaldır ve yenisini ekle
        const chunkKey = `${chunk.x},${chunk.z}`;
        if (this.scene.getObjectByName(chunkKey)) {
            this.scene.remove(this.scene.getObjectByName(chunkKey));
        }
        
        meshGroup.name = chunkKey;
        this.scene.add(meshGroup);
    }

    getBlock(x, y, z) {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkZ = Math.floor(z / CHUNK_SIZE);
        const chunk = this.chunks.get(`${chunkX},${chunkZ}`);
        
        if (!chunk) return BLOCK_TYPES.AIR;
        
        const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localZ = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        
        return chunk.getBlock(localX, y, localZ);
    }

    setBlock(x, y, z, blockType) {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkZ = Math.floor(z / CHUNK_SIZE);
        const chunk = this.chunks.get(`${chunkX},${chunkZ}`);
        
        if (!chunk) return;
        
        const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localZ = ((z % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        
        chunk.setBlock(localX, y, localZ, blockType);
        this.updateChunkMesh(chunk);
    }

    handleBlockClick(intersection, inventorySystem) {
        const point = intersection.point;
        const face = intersection.face;
        
        // Blok kırma/yerleştirme işlemi
        const blockPos = this.worldToBlockCoords(point, face);
        
        if (intersection.object.userData.isBlock) {
            // Blok kır
            this.setBlock(blockPos.x, blockPos.y, blockPos.z, BLOCK_TYPES.AIR);
            
            // Envantere ekle
            const blockType = intersection.object.userData.blockType;
            inventorySystem.addItem(blockType, 1);
        } else {
            // Blok yerleştir
            const selectedBlock = inventorySystem.getSelectedBlock();
            if (selectedBlock !== BLOCK_TYPES.AIR) {
                this.setBlock(blockPos.x, blockPos.y, blockPos.z, selectedBlock);
                inventorySystem.removeItem(selectedBlock, 1);
            }
        }
    }

    worldToBlockCoords(worldPos, face) {
        // Dünya koordinatlarını blok koordinatlarına çevir
        return {
            x: Math.floor(worldPos.x),
            y: Math.floor(worldPos.y),
            z: Math.floor(worldPos.z)
        };
    }

    update() {
        // Chunk yükleme/boşaltma optimizasyonu
        this.chunkManager.updateChunks(this.camera);
    }

    getMeshes() {
        return this.scene.children.filter(child => child.userData.isChunk);
    }
}

class Chunk {
    constructor(x, z, size) {
        this.x = x;
        this.z = z;
        this.size = size;
        this.blocks = new Array(size * size * WORLD_HEIGHT).fill(BLOCK_TYPES.AIR);
    }

    getIndex(x, y, z) {
        return x + z * this.size + y * this.size * this.size;
    }

    getBlock(x, y, z) {
        if (y < 0 || y >= WORLD_HEIGHT || x < 0 || x >= this.size || z < 0 || z >= this.size) {
            return BLOCK_TYPES.AIR;
        }
        return this.blocks[this.getIndex(x, y, z)];
    }

    setBlock(x, y, z, blockType) {
        if (y < 0 || y >= WORLD_HEIGHT || x < 0 || x >= this.size || z < 0 || z >= this.size) {
            return;
        }
        this.blocks[this.getIndex(x, y, z)] = blockType;
    }
}

class ChunkManager {
    constructor() {
        this.visibleDistance = 8;
    }

    buildChunkMesh(chunk, geometry, materials) {
        const meshGroup = new THREE.Group();
        meshGroup.userData.isChunk = true;
        meshGroup.userData.chunk = chunk;
        
        // Basit mesh oluşturma (optimizasyon gerekli)
        for (let x = 0; x < chunk.size; x++) {
            for (let y = 0; y < WORLD_HEIGHT; y++) {
                for (let z = 0; z < chunk.size; z++) {
                    const blockType = chunk.getBlock(x, y, z);
                    if (blockType !== BLOCK_TYPES.AIR) {
                        const mesh = new THREE.Mesh(geometry, materials[blockType]);
                        mesh.position.set(
                            x + chunk.x * chunk.size,
                            y,
                            z + chunk.z * chunk.size
                        );
                        mesh.userData.isBlock = true;
                        mesh.userData.blockType = blockType;
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        meshGroup.add(mesh);
                    }
                }
            }
        }
        
        return meshGroup;
    }

    updateChunks(camera) {
        // Chunk görünürlük optimizasyonu burada yapılacak
        // Şimdilik tüm chunk'ları görünür yapıyoruz
    }
}