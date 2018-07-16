
import axios from "axios";
import iView from "iview";

export async function get (url) {
    let response = null;
    try {
        response = await axios.get(url);
        if (response.status != 200) {
            iView.Message.error("访问接口出现错误");
        }
    }
    catch (e) {
        iView.Message.error("访问接口出现错误");
    }
    return response;
};