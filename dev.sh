#!/bin/bash

# SkyWorld v2.0 - Development Script
# @author MiniMax Agent

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install dependencies
install_deps() {
    print_info "Installing dependencies..."
    if command_exists npm; then
        npm install
    elif command_exists yarn; then
        yarn install
    elif command_exists pnpm; then
        pnpm install
    else
        print_error "No package manager found. Please install npm, yarn, or pnpm."
        exit 1
    fi
    print_success "Dependencies installed successfully"
}

# Function to start development server
start_dev() {
    print_info "Starting development server..."
    
    if command_exists npx; then
        npx live-server --port=8080 --open=/index.html --cors=true --entry-file=/index.html
    elif command_exists http-server; then
        http-server -p 8080 -c-1 --cors
    elif command_exists python3; then
        python3 -m http.server 8080
    elif command_exists python; then
        python -m SimpleHTTPServer 8080
    else
        print_error "No suitable development server found."
        print_info "Please install one of: npx, http-server, python3, or python"
        exit 1
    fi
}

# Function to build for production
build_prod() {
    print_info "Building for production..."
    
    # Create build directory
    mkdir -p dist
    
    # Copy essential files
    cp index.html dist/
    cp -r src dist/
    cp -r assets dist/
    cp -r docs dist/
    cp package.json dist/
    cp README.md dist/
    cp LICENSE dist/
    cp sw.js dist/
    cp site.webmanifest dist/
    
    print_success "Production build completed in dist/"
}

# Function to deploy to GitHub Pages
deploy_github() {
    print_info "Deploying to GitHub Pages..."
    
    if ! command_exists git; then
        print_error "Git is not installed"
        exit 1
    fi
    
    # Build first
    build_prod
    
    # Deploy using gh-pages
    if command_exists npx; then
        npx gh-pages -d dist -m "Deploy SkyWorld v2.0"
    else
        print_error "npx is required for deployment"
        exit 1
    fi
    
    print_success "Deployed to GitHub Pages successfully"
}

# Function to run linting
lint_code() {
    print_info "Running linter..."
    
    # Check for common issues
    if command_exists grep; then
        # Check for console.log statements
        if grep -r "console\.log" src/; then
            print_warning "Found console.log statements in source code"
        fi
        
        # Check for TODO comments
        if grep -r "TODO" src/; then
            print_warning "Found TODO comments in source code"
        fi
        
        # Check for debugger statements
        if grep -r "debugger" src/; then
            print_warning "Found debugger statements in source code"
        fi
    fi
    
    print_success "Linting completed"
}

# Function to analyze bundle size
analyze_bundle() {
    print_info "Analyzing bundle size..."
    
    # Check file sizes
    if [ -f "index.html" ]; then
        size=$(wc -c < index.html)
        print_info "index.html: ${size} bytes"
    fi
    
    # Count lines of code
    if command_exists find && command_exists wc; then
        js_files=$(find src/ -name "*.js" | wc -l)
        total_lines=$(find src/ -name "*.js" -exec wc -l {} + | tail -1 | awk '{print $1}')
        print_info "JavaScript files: ${js_files}"
        print_info "Total lines of code: ${total_lines}"
    fi
    
    print_success "Bundle analysis completed"
}

# Function to clean build artifacts
clean() {
    print_info "Cleaning build artifacts..."
    
    rm -rf dist/
    rm -rf node_modules/
    rm -rf .cache/
    rm -rf .parcel-cache/
    
    print_success "Clean completed"
}

# Function to show help
show_help() {
    echo "SkyWorld v2.0 Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install    Install project dependencies"
    echo "  dev        Start development server"
    echo "  build      Build for production"
    echo "  deploy     Deploy to GitHub Pages"
    echo "  lint       Run code analysis"
    echo "  analyze    Analyze bundle size"
    echo "  clean      Clean build artifacts"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 dev        # Start development server"
    echo "  $0 deploy     # Deploy to GitHub Pages"
}

# Main script logic
case "${1:-help}" in
    install)
        install_deps
        ;;
    dev)
        install_deps
        start_dev
        ;;
    build)
        build_prod
        ;;
    deploy)
        deploy_github
        ;;
    lint)
        lint_code
        ;;
    analyze)
        analyze_bundle
        ;;
    clean)
        clean
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac