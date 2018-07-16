
import * as http from "../utils/http";

//根据QQ号查询
export async function queryByQQNum (qqNum) {
    let response = await http.get(`http://127.0.0.1:10241/qq/${ qqNum }`);
    if (response.status == 200) {
        return response.data;
    }
    else {
        return null;
    }
}

//根据群号查询
export async function queryByGroupNum (groupNum) {
    let response = await http.get(`http://127.0.0.1:10241/group/${ groupNum }`);
    if (response.status == 200) {
        return response.data;
    }
    else {
        return null;
    }   
}

//根据QQ号进行二层拓展查询
export async function queryByQQNumExt (qqNum) {
    let response = await http.get(`http://127.0.0.1:10241/qqext/${ qqNum }`);
    if (response.status == 200) {
        return response.data;
    }
    else {
        return null;
    }
}
