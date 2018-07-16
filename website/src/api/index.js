
import http from "../utils/http";

export default {
    queryByQQNum: async (qqNum) => {
        let response = await http.get(`http://127.0.0.1:10241/qq/${ qqNum }`);
        console.log(response);
    }
}

// export async function queryByQQNum (qqNum) {
//     let response = await http.get(`http://127.0.0.1:10241/qq/${ qqNum }`);
//     console.log(response);
// }

// export async function queryByGroupNum (groupNum) {
    
// }

// export async function queryByQQNumExt (qqNum) {
    
// }

// export async function queryByGroupNumExt (groupNum) {
    
// }