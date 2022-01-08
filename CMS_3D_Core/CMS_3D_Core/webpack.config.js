


module.exports = {
    entry: {
        layout: './Scripts/entry/index_layout.js',
        tdpart: './Scripts/entry/index_tdpart.js',
        tdarticle: './Scripts/entry/index_tdarticle.ts',
        testthree: './Scripts/entry/index_testthree.js',
        testthree2: './Scripts/entry/index_testthree2.ts',
        tdarticle_wp: './Scripts/entry/index_tdarticle_wp.ts',
    },
    output: {
        path: __dirname + '/wwwroot/js/dist',
        filename: '[name].bundle.js'
    },
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    resolve: {
        extensions: [".ts", ".js"], // Reactの.tsxや.jsxの拡張子も扱いたい場合は配列内に追加する
    },
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
                    "css-loader",
                ],
            },
            {
                // for .ts
                test: /\.ts$/,
                // Sassファイルの読み込みとコンパイル
                use: [
                    'ts-loader',
                    //exclude: /node_modules/,
                ],
            },
        ],
    },
};