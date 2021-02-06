const fs = require('fs')
const imagemagick = require('imagemagick-convert')

const default_image_icon = "apple-touch-icon.png"
const default_launch_screens = ["launch-screen-portrait.png","launch-screen-landscape.png"]
const default_image_ipad = "ipad.png"


class AppleTouchIconsPlugin {

	constructor(config) {

		if (typeof(config) == "undefined"){
			this.icon = null
			this.launch_screen = null
			this.ipad = null
			this.resize = "crop"
			this.icon_sizes = [[57, 57],[72, 72],[76, 76],[114, 114],[120, 120],[144, 144],[152, 152],[167, 167],[180, 180], [1024,1024]]
			this.launch_screen_sizes = [[1024,481],[1024,481]]
			this.ipad_sizes = [[568,320],[667,375],[736,414],[812,375],[1024,768],[834,834], [1024,1024] ]
		} else {

			if (typeof (config.icon) == "undefined")
				this.icon = null
			else
				this.icon = config.icon

			if (typeof (config.launch_screen) == "undefined")
				this.launch_screen = null
			else
				this.launch_screen = config.launch_screen


			if (typeof (config.icon_sizes) == "undefined")
				this.icon_sizes = [[57, 57], [72, 72], [76, 76], [114, 114], [120, 120], [144, 144],[152, 152], [167, 167], [180, 180], [1024, 1024]]
			else
				this.icon_sizes = config.icon_sizes

			if (typeof (config.launch_screen_sizes) == "undefined")
				this.launch_screen_sizes = [[1024,481], [1024, 481]]  // h/w
			else
				this.launch_screen_sizes = config.launch_screen_sizes

			if (typeof (config.ipad_sizes) == "undefined")
				this.ipad_sizes = [[568,320],[667,375],[736,414],[812,375],[1024,768],[834,834], [1024,1024] ]
			else
				this.ipad_sizes = config.ipad_sizes

			if (typeof (config.resize) == "undefined")
				this.resize = 'crop'
			else
				this.resize = config.resize
		}

		// handlers
		this.process = this.process.bind(this)
	}

	compile(compilation,filename, data, size) {

		let name =  filename.split('.')[0];
		let ext =  filename.split('.').pop();

		const [height, ...width] = size

		const new_file_path = name + "-" + height + "x" + width + "." + ext

		compilation.assets[new_file_path] = {
			source: () => data,
			size: () => data.length
		};

		return filename;
	}

	async processImage(filename, size, options = {resize: this.resize}) {

		let format =  filename.split('.').pop();

		let srcFormat;

		switch(format.toLowerCase()) {
			case 'jpg':
				srcFormat =  'JPEG'
				break;
			case 'jpeg':
				srcFormat =  'JPEG'
				break;
			default:
				srcFormat =  'PNG'
		}

		const [height, ...width] = size;

		return await imagemagick.convert({
			srcData: fs.readFileSync(filename),
			srcFormat: srcFormat,
			width: width,
			height: height,
			resize: options.resize,
			format: 'PNG'
		});


	}

	processFile(compilation,filename, options) {

			const that = this

		return  options.icon_sizes.map(size =>  {
				let image_data = that.processImage(filename, size,options)
				 that.compile(compilation, image_data, filename, size)
			});

	}

	processIpad(compilation, filename, options) {

			let that = this

		return options.ipad_sizes.map(size =>  {
				let image_data = that.processImage(filename, size,options)
				 that.compile(compilation, image_data, filename, size)
			});


	}

	processScreen(compilation, filename, options) {

			let that = this

		return options.launch_screen_sizes.map(size =>  {
				let image_data = that.processImage(filename, size,options)
				 that.compile(compilation, image_data, filename, size)
			});

	}

	process(compilation, callback) {

		let assetNames = Object.keys(compilation.assets);

		if(this.icon == null) {

			assetNames.map(name => {
				let currentAsset = compilation.assets[name];

				let source = currentAsset.source()

				if(name === default_image_icon){
					 this.processFile(compilation, source, this.options)
				}

			});

		}else{

			assetNames.map(name => {
				let currentAsset = compilation.assets[name];

				let source = currentAsset.source()

				if(name === this.icon){
					this.processFile(compilation, source, this.options)
				}

			});
		}

		if(this.launch_screen == null) {

			assetNames.map(name => {
				let currentAsset = compilation.assets[name];

				let source = currentAsset.source()

				if(default_launch_screens.includes(name)){
					 this.processScreen(source, this.options)
				}

			});

		}else{

			assetNames.map(name => {
				let currentAsset = compilation.assets[name];

				let source = currentAsset.source()

				if(name === this.launch_screen){
					 this.processScreen(compilation, source, this.options)
				}

			});

		}

		if(this.ipad == null) {

			assetNames.map(name => {
				let currentAsset = compilation.assets[name];

				let source = currentAsset.source()

				if(name === default_image_ipad){
					this.processIpad(compilation, source, this.options)
				}

			});

		}else{

			assetNames.map(name => {
				let currentAsset = compilation.assets[name];

				let source = currentAsset.source()

				if(name === this.ipad){
					 this.processIpad(compilation, source, this.options)
				}

			});
		}

		callback()
	}

	apply(compiler) {
		this.compiler = compiler
		compiler.hooks.emit.tapAsync('AppleTouchIconsPlugin', this.process)
	}
}

module.exports = AppleTouchIconsPlugin;

