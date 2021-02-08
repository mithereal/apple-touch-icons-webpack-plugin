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
					ipad_sizes = [[568, 320], [667, 375], [736, 414], [812, 375], [1024, 768], [834, 834], [1024, 1024]],
					basepath = __dirname
				} = {}) {
		this.icon = icon;
		this.launch_screen = launch_screen;
		this.ipad = ipad;
		this.resize = resize;
		this.icon_sizes = icon_sizes;
		this.launch_screen_sizes = launch_screen_sizes;
		this.ipad_sizes = ipad_sizes;
		this.basepath = basepath;

		// handlers
		this.process = this.process.bind(this)
	}

	compile(compilation, filename, data, size) {
		var path = require("path");
		const filenameWithExtension = path.basename(filename)
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

			//get path
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

	processFile(compilation, filename, sizes) {

		const that = this

		return sizes.map(size => {
			that.processImage(filename, size, sizes).then(image_data => {
				return this.compile(compilation, filename,image_data, size);
			})
		});

	}

	processIpad(compilation, filename, sizes) {

		let that = this

		return this.ipad_sizes.map(size => {
			that.processImage(filename, size, sizes).then(image_data => {
				return this.compile(compilation, filename,image_data, size);
			})
		});
	}

	processScreen(compilation, filename, sizes) {

		let that = this

		return this.launch_screen_sizes.map(size => {
			that.processImage(filename, size, sizes).then(image_data => {
				return this.compile(compilation, filename,image_data, size);
			})
		});
	}

	process(compilation, callback) {

		let assetNames = Object.keys(compilation.assets);

		Promise.all(
			assetNames.map(name => {
console.log(name)
				let filenameWithExtension = name.replace(/^.*[\\\/]/, '');

				if (this.icon == null) {

					if (filenameWithExtension === default_image_icon) {

						const path_to_file = this.basepath + "/" + name

						this.processFile(compilation, path_to_file, this.icon_sizes)
					}

				} else {

					if (filenameWithExtension === this.icon) {

						const path_to_file = this.basepath + "/" + name

						this.processFile(compilation, path_to_file, this.icon_sizes)
					}
				}

				if (this.launch_screen == null) {
					if (default_launch_screens.includes(filenameWithExtension)) {

						const path_to_file = this.basepath + "/" + name

						this.processScreen(compilation,path_to_file, this.launch_screen_sizes)
					}
				} else {
					if (filenameWithExtension === this.launch_screen) {

						const path_to_file = this.basepath + "/" + name

						this.processScreen(compilation, path_to_file, this.launch_screen_sizes)
					}
				}

				if (this.ipad == null) {
					if (filenameWithExtension === default_image_ipad) {

						const path_to_file = this.basepath + "/" + name

						this.processIpad(compilation, path_to_file, this.ipad_sizes)
					}
				} else {
					if (filenameWithExtension === this.ipad) {

						const path_to_file = this.basepath + "/" + name

						this.processIpad(compilation, path_to_file, this.ipad_sizes)
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