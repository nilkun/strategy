const settings = {
    width: 0,
    height: 0,

    init(width, height) {
        this.setResolution(width, height);
    },
    
    setResolution(width, height) {
        this.width = width;
        this.height = height;
    }
}

export default settings;