
const { createApp } = Vue;
const app = {
    // 資料
    data(){
        return{
            user : {
                username:"",
                password:"",
            }
        }
    },
    //方法集
    methods: {
        //登入
        login(){
            if (this.user.username == "" || this.user.password == ""){
                alert("請輸入帳號密碼喔！");
                return
            }else{
                // #1 發送登入 api ，並儲存Token
            axios.post(`${url}/admin/signin`, this.user)
            .then(res => {
                // console.log(res.data);
                // 一般寫法
                // const token = res.data.token;
                // const expired = res.data.expired;

                // 解構賦值寫法
                const {token, expired} = res.data;
                //存token ,expired;
                // document.cookie = "someCookieName=true; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
                document.cookie = `week2HexToken=${token}; expires=${ new Date (expired) };`;
                //這邊也都要this.才可以取到
                this.checkLogin();
                //跳轉至後台頁面
                location.href = "backStage.html";
            })
            .catch(error => {
                alert("尚未登入");
            })
            }
        },
        //驗證是否登入
        checkLogin(){
            // #2 取得 Token (Token 僅需設定一次)
            // var myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)test2\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)week2HexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;

            // 確認是否登入 api
            // axios.post(`${url}/api/user/check`)
            //     .then(res => {
            //         console.log(res.data)
            //     })
            //     .catch(error => {
            //         console.log(error.response.data);
                   
            //     })
            
        },
    },
     //生命週期，元件開始的時候，執行以下這段
    mounted() {
        
    },
}
createApp(app).mount("#app")
      



