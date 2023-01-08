const { createApp } = Vue;
const app = {
    data() {
        return {
            //產品資料
            products:[],
            addProductData:{
                "data": {
                    "title": "[賣]動物園造型衣服3",
                    "category": "衣服2",
                    "origin_price": 100,
                    "price": 300,
                    "unit": "個",
                    "description": "Sit down please 名設計師設計",
                    "content": "這是內容",
                    "is_enabled": 1,
                    "imageUrl": "主圖網址",
                    "imagesUrl": [
                      "圖片網址一",
                      "圖片網址二",
                      "圖片網址三",
                      "圖片網址四",
                      "圖片網址五"
                    ]
                  }
            },
            tempData:{
                "imagesUrl":[]
            }
        }
    },
    methods: {
        //取得產品列表
        getProductList() {
            axios.get(`${url}/api/${path}/admin/products`)
                .then(res => {
                    this.products = res.data.products;
                    console.log(this.products);
                })
                .catch(error => {
                    console.log(error.response.data);
                    alert("請先登入帳號密碼喔～不要偷懶(ゝ∀･)b 感謝你！")
                    location.href = "index.html";
                })
        },
        //取得 Token (Token 僅需設定一次)
        checkLogin() {
            // var myCookie = document.cookie.replace(/(?:(?:^|.*;\s*)test2\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)week2HexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            // console.log(token);
            axios.defaults.headers.common['Authorization'] = token;
        },
        //新增產品
        addProduct() {
            axios.post(`${url}/api/${path}/admin/product`,data)
                .then(res => {
                    console.log(res.data);
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        },
        //編輯產品
        editProduct(product) {
            console.log(product);
            this.tempData = {...product};
        },
        //確認編輯
        confirmEdit() {
            this.products.forEach( (editProduct,id) => {
                if(editProduct.id === this.tempData.id){
                    this.products[id] = this.tempData;
                    console.log(this.tempData);
                }
            });
             axios.put(`${url}/api/${path}/admin/product/${this.tempData.id}`,{data:this.tempData})//這邊格式比較特別本來，要對照文件給的格式放入data
                .then(res => {
                    console.log(res.data);
                    
                })
                .catch(error => {
                    console.log(error.response.data);
                })
            
        },
        //上傳圖片
        uploadImage() {
            this.tempData.imagesUrl = [];
            this.tempData.imagesUrl.push('');
        }
    },
    mounted() {
        this.checkLogin();
        this.getProductList();
        
    },
}
createApp(app).mount('#app')