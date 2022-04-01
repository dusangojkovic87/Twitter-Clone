
const path = require('path');

module.exports = {
    mode:"development",
    entry:{
        detailsPage:'./src/Public/js/detailsPage.ts',
        mainPage:'./src/Public/js/mainPage.ts',
        messagePage:'./src/Public/js/messagePage.ts',
        postPage:'./src/Public/js/postPage.ts',
        profilePage:'./src/Public/js/profilePage.ts',
        searchUsersPage:'./src/Public/js/searchUsersPage.ts',
        'Interfaces/Message':'./src/Public/js/interfaces/Message.ts',
        'Interfaces/Post':'./src/Public/js/interfaces/Post.ts',
        'Interfaces/User':'./src/Public/js/interfaces/User.ts',
    },
    devtool: 'inline-source-map',
    devServer: {
        inline:true,
        port: 3000
      },
    module:{
        rules:[{
            test:/\.ts$/,
            use:'ts-loader',
            include:[path.resolve(__dirname,'src','Public','js')]

        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output:{
        publicPath:'Public',
        filename:'[name].[contenthash].js',
        path:path.resolve(__dirname,'build','Public','js'),
        clean: true,
    }
    
}