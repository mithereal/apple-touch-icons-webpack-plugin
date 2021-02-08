const fs = require('fs')
const imagemagick = require('imagemagick-convert')

const default_image_icon = "apple-touch-icon.png"
const default_launch_screens = ["launch-screen-portrait.png","launch-screen-landscape.png"]
const default_image_ipad = "ipad.png"


class AppleTouchIconsPlugin {

	constructor({
					icon = null,
					launch_screen = null,
					ipad = null,
					resize = "crop",
					icon_sizes = [[57, 57], [72, 72], [76, 76], [114, 114], [120, 120], [144, 144], [152, 152], [167, 167], [180, 180], [1024, 1024]],
					launch_screen_sizes = [[1024, 481], [1024, 481]],
					ipad_sizes = [[568, 320], [667, 375], [736, 414], [812, 375], [1024, 768], [834, 834], [1024, 1024]]
				} = {}) {
		this.icon = icon;
		this.launch_screen = launch_screen;
		this.ipad = ipad;
		this.resize = resize;
		this.icon_sizes = icon_sizes;
		this.launch_screen_sizes = launch_screen_sizes;
		this.ipad_sizes = ipad_sizes;

		// handlers
		this.process = this.process.bind(this)
	}

	compile(compilation, filename, data, size) {

		const filenameWithExtension = filename.replace(/^.*[\\\/]/, '');
		const name = filenameWithExtension.split('.')[0];
		const ext = filenameWithExtension.split('.').pop();

		const [height, ...width] = size

		const new_file_path = name + "-" + height + "x" + width + "." + ext

		compilation.assets[new_file_path] = {
			source: () => data,
			size: () => data.length
		};

		return compilation;
	}

	async processImage(filename, size, options = {resize: this.resize}) {

		let format = filename.split('.').pop();

		let srcFormat;

		switch (format.toLowerCase()) {
			case 'jpg':
				srcFormat = 'JPEG'
				break;
			case 'jpeg':
				srcFormat = 'JPEG'
				break;
			default:
				srcFormat = 'PNG'
		}

		const [height, ...width] = size;

		return await new Promise(resolve => {
			resolve( imagemagick.convert({
				srcData: fs.readFileSync(filename),
				srcFormat: srcFormat,
				width: width,
				height: height,
				resize: options.resize,
				format: 'PNG'
			})
			);
		})
		}

	processFile(compilation, filename, options) {

		const that = this

		return options.icon_sizes.map(size => {
			that.processImage(filename, size, options).then(image_data => {
				return this.compile(compilation, image_data, filename, size);
			})
		});

	}

	processIpad(compilation, filename, options) {

		let that = this

		return options.ipad_sizes.map(size => {
			that.processImage(filename, size, options).then(image_data => {
				return this.compile(compilation, image_data, filename, size);
			})
		});
	}

	processScreen(compilation, filename, options) {

		let that = this

		return options.launch_screen_sizes.map(size => {
			that.processImage(filename, size, options).then(image_data => {
				return this.compile(compilation, image_data, filename, size);
			})
		});
	}

	process(compilation, callback) {

		let assetNames = Object.keys(compilation.assets);

		Promise.all(
			assetNames.map(name => {

				if (this.icon == null) {

					if (name === default_image_icon) {
						let currentAsset = compilation.assets[name];

						let source = currentAsset.source()

						this.processFile(compilation, source, this.options)
					}

				} else {
					if (name === this.icon) {
						let currentAsset = compilation.assets[name];

						let source = currentAsset.source()

						this.processFile(compilation, source, this.options)
					}
				}

				if (this.launch_screen == null) {
					if (default_launch_screens.includes(name)) {
						let currentAsset = compilation.assets[name];

						let source = currentAsset.source()

						this.processScreen(source, this.options)
					}
				} else {
					if (name === this.launch_screen) {
						let currentAsset = compilation.assets[name];

						let source = currentAsset.source()

						this.processScreen(compilation, source, this.options)
					}
				}

				if (this.ipad == null) {
					if (name === default_image_ipad) {
						let currentAsset = compilation.assets[name];

						let source = currentAsset.source()

						this.processIpad(source, this.options)
					}
				} else {
					if (name === this.ipad) {
						let currentAsset = compilation.assets[name];

						let source = currentAsset.source()

						this.processIpad(compilation, source, this.options)
					}
				}
				return Promise.resolve(0);
			})
		).then(args => {

			callback()
		});

	}

	apply(compiler) {
		this.compiler = compiler

		if (compiler.hooks) {
			compiler.hooks.emit.tapAsync('AppleTouchIconsPlugin', this.process)
		} else {
			// older versions
			compiler.plugin('emit', this.process);
		}
	}
}

module.exports = AppleTouchIconsPlugin;