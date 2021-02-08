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
//  all options
// *sizes is a list ie. [[h,w],[h,w],[h,w,]] 
// `*launch_screen_sizes` is a list ie. [[h,w],[h,w]] that is matched to the `launch_screen` option index
// `icon` and `launch_screen` are optional; defaults to see below, ie. if options are null 
// "apple-touch-icon.png", "launch_screen_portrait.png","launch_screen_landscape.png", "ipad.png" are expected to be somewhere in the path
// 'resize' can be fit, fill or crop (crop resizes then crops the image)
const AppleTouchIconsPlugin = require('apple-touch-icons-webpack-plugin')

options = {
    icon: "apple-touch-icon.png",
    launch_screen: ["launch-screen-portrait.png","launch-screen-landscape.png"],
    ipad: "ipad.png",
    icon_sizes: [[57, 57],[72, 72],[76, 76],[114, 114],[120, 120],[152, 152],[167, 167],[180, 180], [1024,1024]],
    launch_screen_sizes: [[481, 1024],[481, 1024]],
    ipad_sizes: [[568,320],[667,375],[736,414],[812,375],[1024,768],[834,834], [1024,1024] ],
    resize: "crop",
    basepath: "absolute_path_to_assets"
};

module.exports = {
plugins: [
new AppleTouchIconsPlugin(
    options,
)
]
}

//  minimum options
// "apple-touch-icon.png", "launch-screen-portrait.png","launch-screen-landscape.png","ipad.png" are expected to be somewhere in the path


module.exports = {
    plugins: [
        new AppleTouchIconsPlugin({basepath: "absolute_path_to_assets"})
    ]
}
```

#### Html Config

```html
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
  <meta name="robots" content="noindex, nofollow">
  <meta name="viewport" content="width = device-width, initial-scale = 1.0, minimum-scale = 1, maximum-scale = 1, user-scalable = no">
  <meta name="apple-mobile-web-app-title" content="" />
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  <meta name="application-name" content="">
  <meta name="msapplication-starturl" content="">

  <link rel="apple-touch-icon" href="/path/to/apple-touch-icon.png" />
  <link rel="apple-touch-icon" sizes="57x57" href="/path/to/apple-touch-icon-57x57.png" />
  <link rel="apple-touch-icon" sizes="72x72" href="/path/to/apple-touch-icon-72x72.png"/>
  <link rel="apple-touch-icon" sizes="76x76" href="/path/to/apple-touch-icon-76x76.png" />
  <link rel="apple-touch-icon" sizes="114x114" href="/path/to/apple-touch-icon-114x114.png" />
  <link rel="apple-touch-icon" sizes="120x120" href="/path/to/apple-touch-icon-120x120.png" />
  <link rel="apple-touch-icon" sizes="144x144" href="/path/to/apple-touch-icon-144x144.png" />
  <link rel="apple-touch-icon" sizes="152x152" href="/path/to/apple-touch-icon-152x152.png" />
  <link rel="apple-touch-icon" sizes="167x167" href="/path/to/apple-touch-icon-167x167.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/path/to/apple-touch-icon-180x180.png" />
  <link rel="apple-touch-startup-image" href="/path/to/ipad-landscape-1024x481.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)" />
  <link rel="apple-touch-startup-image" href="/path/to/ipad-portrait-1024x481.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)" />
  <link rel="apple-touch-startup-image" href="/path/to/ipad-568x320.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="/path/to/ipad-667x375.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="/path/to/ipad-736x414.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="/path/to/ipad-812x375.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="/path/to/ipad-1024x768.png" media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="/path/to/ipad-834x834.png" media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
  <link rel="apple-touch-startup-image" href="/path/to/ipad-1024x1024.png" media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)">
  <meta name="author" content="@">
    <title>Example Title</title>
</head>  
```
