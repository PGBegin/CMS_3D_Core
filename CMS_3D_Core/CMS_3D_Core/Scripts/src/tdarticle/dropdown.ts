//ドロップダウンリスト操作用関数




//ドロップダウンリストをwebapiからの指示内容に従い更新する
//api_url データをくれるwebapi(必ずセレクトリスト形式、jsonの関数を設定の事)
//target_elementid 対象のセレクトリストのid
export async function UpdateDropdownListAjax(api_url: string, id_selectlist: string, value_selected : any) {//, cname_value: string, cname_innertext: string) {



    //cors対策追加
    //指定urlからデータを取得
    return fetch(api_url, { mode: 'cors' })
        .then(response => {

            return response.json();

        })
        .then(data => { // 処理が成功した場合に取得されるJSONデータ
            console.log(data);
            //選択肢クリア
            const parent_option: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id_selectlist)!;
            while (parent_option.lastChild) {
                parent_option.removeChild(parent_option.lastChild);
            }

            //let optionitem;

            for (var i in data) {
                const optionitem = parent_option.appendChild(document.createElement("option"));
                optionitem.setAttribute("value", data[i]['value']);
                optionitem.textContent = data[i]['text'];
            }
            parent_option.value = value_selected.toString();
        });


}