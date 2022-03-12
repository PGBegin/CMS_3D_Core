


export async function FetchPostApi(str_url: string, token: string, updObject: any) {

    const response = await fetch(str_url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "RequestVerificationToken": token
        },
        body: JSON.stringify(updObject)
    });
    //const data = await response.json();
    //console.log(data);
    //return data;

    return response;

}