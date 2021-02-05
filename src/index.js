const path = require('path')
const fs = require('fs')
const utils = require('./utils')
const imagemagick = require('imagemagick-convert')

const default_image_icon = "apple-touch-icon.png"
const default_launch_screens = ["launch_screen_portrait.png","launch_screen_landscape.png"]

class AppleTouchIconsPlugin {

	constructor(config) {
		// source from the context

		if (typeof(config) == "undefined"){
			this.icon = null
			this.launch_screen = null
			this.source = ""
			this.resize = "crop"
			this.icon_sizes = [[57, 57],[72, 72],[76, 76],[114, 114],[120, 120],[152, 152],[167, 167],[180, 180], [1024,1024]]
			this.launch_screen_sizes = [[481, 1024],[481, 1024]]
			this.destination = ""
		} else {

			if (typeof (config.icon) == "undefined")
				this.icon = null
			else
				this.icon = config.icon

			if (typeof (config.launch_screen) == "undefined")
				this.launch_screen = null
			else
				this.launch_screen = config.launch_screen

			if (typeof (config.source) == "undefined")
				this.source = ""
			else
				this.source = config.source

			if (typeof (config.icon_sizes) == "undefined")
				this.icon_sizes = [[57, 57], [72, 72], [76, 76], [114, 114], [120, 120], [152, 152], [167, 167], [180, 180], [1024, 1024]]
			else
				this.icon_sizes = config.icon_sizes

			if (typeof (config.launch_screen_sizes) == "undefined")
				this.launch_screen_sizes = [[481, 1024], [481, 1024]]  // h/w
			else
				this.launch_screen_sizes = config.launch_screen_sizes

			if (typeof (config.destination) == "undefined")
				this.destination = ""
			else
				this.destination = config.destination

			if (typeof (config.resize) == "undefined")
				this.resize = 'crop'
			else
				this.resize = config.resize
		}

		this.context = null

		// handlers
		this.process = this.process.bind(this)
	}

	writeFile(path, data) {

		fs.writeFile(path, data, (err) => {
			if (err)
				console.log(err);
			else {
				utils.logger.info(`Successfully Exported ${path}`)
			}
		});
		return null;
	}

	async processImage(compilation, context, filename, size,options = {resize: this.resize}) {

		let format =  filename.split('.').pop();

		let srcFormat = 'PNG';

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

		let path = context + "/" + filename

		const [height, ...width] = size;

		let imgBuffer = await imagemagick.convert({
			srcData: fs.readFileSync(path),
			srcFormat: srcFormat,
			width: width,
			height: height,
			resize: options.resize,
			format: 'PNG'
		});

		utils.logger.info(`Processing ${path}`)

		return imgBuffer;
	}

	 processFile(compilation, context, filename, options) {
		let reply;

			let that = this

			let destinationPath = this.destination ? path.join(this.destination, filename) : filename

			options.icon_sizes.forEach( function(size) {
				let image_data = that.processImage(compilation, context, filename, size,options)
				let reply = that.writeFile(image_data, destinationPath)
			});

		return reply
	}

	processScreen(compilation, context, filename, options) {
		let reply;

			let that = this

			let destinationPath = this.destination ? path.join(this.destination, filename) : filename

			options.launch_screen_sizes.forEach( function(size) {
				let image_data = that.processImage(compilation, context, filename, size,options)
				let reply = that.writeFile(image_data, destinationPath)
			});

		return reply
	}
	process(compilation, callback) {
		const { context } = this.compiler.options
		this.context = path.join(context, this.source)
		const files = utils.getRequiredFiles(this.context, '')
		const options = this.options

		if(this.icon == null) {

			for (const file of files) {

			const img_file = this.context + "/" + default_image_icon

				if(file === img_file){
					let result = this.processFile(compilation, this.context, file, options)
				}


			}
		}else{

			let result = this.processFile(compilation, this.context, this.icon,options )
		}

		if(this.launch_screen == null) {

			for (const file of files) {

				const img_files = default_launch_screens.map(file => this.context + "/" + file);

				///process launch screen is bad
				if(img_files.includes(file)){
					let result = this.processScreen(compilation, this.context, file, options)
				}
			}
		}else{
			let result = this.processScreen(compilation, this.context, this.launch_screen, options)
		}

		callback()
	}

	apply(compiler) {
		this.compiler = compiler
		compiler.hooks.emit.tapAsync('AppleTouchIconsPlugin', this.process)
	}
}

module.exports = AppleTouchIconsPlugin;

