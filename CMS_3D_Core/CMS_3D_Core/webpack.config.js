


module.exports = {
    entry: {
        layout: './Scripts/entry/index_layout.js',
        tdarticle: './Scripts/entry/index_tdarticle.js',
        testthree: './Scripts/entry/index_testthree.js',
        testthree2: './Scripts/entry/index_testthree2.js',
    },
    output: {
        path: __dirname + '/wwwroot/js',
        filename: '[name].bundle.js'
    },
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: "production",
    module: {
        rules: [
            {
                // 対象となるファイルの拡張子(cssのみ)
                test: /\.css$/,
                // Sassファイルの読み込みとコンパイル
                use: [
                    // スタイルシートをJSからlinkタグに展開する機能
                    "style-loader",
                    // CSSをバンドルするための機能
                    "css-loader"
                ],
            },
        ],
    },
};