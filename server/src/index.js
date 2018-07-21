
const Koa = require("koa");
const KoaRouter = require("koa-router");
const KoaStatic = require("koa-static");
const Koa2Cors = require("koa2-cors");
const MSSQL = require("mssql");

const config = {
    user: "sa",
    password: "gu@shi$hao^1993*",
    server: "www.91weixin.net",
    database: "QQGroup",
};

const serverPort = 10241;

function hold404 (ctx, next) {
    let code = 404;
    ctx.status = code;
    ctx.body = {
        code: code,
        data: null,
        msg: "资源不存在",
    };
}

async function main () {
    try {
        let pool = await MSSQL.connect(config);
        let app = new Koa();
        let router = new KoaRouter();

        //服务端跨域配置
        // let cors = Koa2Cors({
        //     origin: function (ctx) {
        //         return "*";
        //     },
        //     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        //     maxAge: 5,
        //     credentials: true,
        //     allowMethods: ['GET'],
        //     allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        // });

        //QQ号拓展查询接口
        router.get('/api/qqext/:id', async (ctx, next) => {
            let qqNum = Number(ctx.params.id);
            let result = await pool.request()
                            .input('QQNum', MSSQL.Int, qqNum)
                            .execute('queryByQQNumExt');
            let code = 200;
            ctx.status = code;
            ctx.body = {
                code: code,
                data: {
                    member: result.recordsets[0],
                    group: result.recordsets[1],
                    link: result.recordsets[2],
                },
                msg: "查询成功",
            };
        });

        //QQ号查询接口
        router.get('/api/qq/:id', async (ctx, next) => {
            let qqNum = Number(ctx.params.id);
            let result = await pool.request()
                            .input('QQNum', MSSQL.Int, qqNum)
                            .execute('queryByQQNum');
            let code = 200;
            ctx.status = code;
            ctx.body = {
                code: code,
                data: {
                    member: result.recordsets[0],
                    group: result.recordsets[1],
                    link: result.recordsets[2],
                },
                msg: "查询成功",
            };
        });

        //群号查询接口
        router.get("/api/group/:num", async (ctx, next) => {
            let groupNum = Number(ctx.params.num);
            let result = await pool.request()
                            .input("groupNum", MSSQL.Int, groupNum)
                            .execute("queryByGroupNum");
            let code = 200;
            ctx.status = code;
            ctx.body = {
                code: code,
                data: {
                    member: result.recordsets[0],
                    group: result.recordsets[1],
                    link: result.recordsets[2],
                },
                msg: "查询成功",
            };
        });

        //QQ信息表查询接口
        router.get("/api/qqtable/:num", async (ctx, next) => {
            let qqNum = Number(ctx.params.num);
            let result = await pool.request()
                            .input("qqNum", MSSQL.Int, qqNum)
                            .execute("queryTableByQQNum");
            let code = 200;
            ctx.status = code;
            ctx.body = {
                code: code,
                data: result.recordsets[0],
                msg: "查询成功",
            };
        });

        //群信息表查询接口
        router.get("/api/grouptable/:num", async (ctx, next) => {
            let groupNum = Number(ctx.params.num);
            let result = await pool.request()
                            .input("groupNum", MSSQL.Int, groupNum)
                            .execute("queryTableByGroupNum");
            let code = 200;
            ctx.status = code;
            ctx.body = {
                code: code,
                data: result.recordsets[0],
                msg: "查询成功",
            };
        });

        app
            //.use(cors)
            .use(KoaStatic(__dirname + "/www"))
            .use(router.routes())
            .use(hold404);

        app.listen(serverPort);
        console.log(`服务已经启动，工作在 ${ serverPort } 端口...`);
    }
    catch (e) {
        console.error(e);
    }
}

main();