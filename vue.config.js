chainWebpack: (config) => {
    config
        .plugin('html')
        .tap(args => {
            args[0].meta = {viewport: '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'};

         return args;
    })
}
