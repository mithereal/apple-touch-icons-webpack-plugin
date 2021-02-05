## apple-touch-icons-webpack-plugin

A Webpack Plugin for automatically creating apple touch icons and launch screens


## Installation
```
npm install --save-dev apple-touch-icons-webpack-plugin
```

Note: This plugin requires Webpack **4.0.0** and above.

## Usage

#### Webpack Config

Update plugins array in webpack.config.js

```javascript
// import the plugin
// *sizes is a list ie. [[h,w],[h,w],[h,w,]] 
// *launch_screen_sizes is a list ie. [[h,w],[h,w]] that is matched to the launch_screen option index
const AppleTouchIconsPlugin = require('apple-touch-icons-webpack-plugin')

options = {
    icon: "./example/assets/touch.png",
    launch_screen: ["./example/assets/launch_screen_portrait.png","./example/assets/launch_screen_landscape.png"],
    source: "./example/assets/images",
    icon_sizes: [[57, 57],[72, 72],[76, 76],[114, 114],[120, 120],[152, 152],[167, 167],[180, 180], [1024,1024]],
    launch_screen_sizes: [[481, 1024],[481, 1024]],
    destination: "../priv/images"
};

module.exports = {
plugins: [
new AppleTouchIconsPlugin(
    options,
)
]
}
```

#### How to change the output destination?

`destination` is an optional configuration, which is relative to `output.path` in webpack configuration.

```javascript
module.exports = {
  plugins: [
    new FileIncludeWebpackPlugin(
      {
        source: './src/templates',
        destination: '../html',
      },
    )
  ]
}
```
