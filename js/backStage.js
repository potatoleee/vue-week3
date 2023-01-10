let editProductModal = '';
let deleteProductModal = '';

// var myModal = new bootstrap.Modal(editProductModal);//實體化
const { createApp } = Vue;

const app = {
    data() {
        return {
            //產品資料
            products:[],
            isNew : false,
            tempData:{
                "imagesUrl":[]
            },
            uploadImages : ""
            
        }
    },
    methods: {
        //取得產品列表
        getProductList() {
            axios.get(`${api_url}/api/${api_path}/admin/products`)
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
        //確認開啟的modal類別
        openModal(state, product) {
            if(state === 'new'  ){
                this.tempData = {
                    "imagesUrl":[]
                };
                editProductModal.show();
                this.isNew = true;
            }else if(state === 'edit'){
                editProductModal.show();
                this.tempData = {...product};
                this.isNew = false;
            } else if (state === 'delete'){
                deleteProductModal.show();
                this.tempData = {...product};
                this.isNew = false;
            }
        },
        //確認按鈕
        confirm() {
            //初始為新增
            let http = 'post';
            let url = `${api_url}/api/${api_path}/admin/product`;
            
            //判斷為編輯
            if( this.isNew === false ){
                http = 'put';
                url = `${api_url}/api/${api_path}/admin/product/${this.tempData.id}`;
            }
             axios[http](url,{data:this.tempData})//這邊格式比較特別本來，要對照文件給的格式放入data
                .then(res => {
                    console.log(res.data);
                    editProductModal.hide();
                    this.getProductList();
                })
                .catch(error => {
                    console.log(error.response.data);
                })
            
        },
        //新增圖片
        uploadImage() {
            this.tempData.imagesUrl = [];
            this.tempData.imagesUrl.push('');
        },
        //刪除單一產品
        deleteProduct() {
            axios.delete(`${api_url}/api/${api_path}/admin/product/${this.tempData.id}`)
                .then(res => {
                    console.log(res.data);
                    deleteProductModal.hide();
                    this.getProductList();
                })
                .catch(error => {
                    console.log(error.response.data);
                })
        },
        //上傳圖片API
        upload(event) {
            // 取得上傳的檔案
            const file = event.target.files[0];
            
            /* 限制檔案上傳型別 */
            let suffixName = file.name.substring(file.name.lastIndexOf('.') + 1);   /* 得到檔案字尾名 */
            if (suffixName !== 'jpg' && suffixName !== 'JPG' && suffixName !== 'png') {
                alert("上傳檔案只能是 jpg、png 格式!，請重新上傳");
                return;
            }
            const formData = new FormData();
            formData.append('file-to-upload', file)
        
            axios.post(`${api_url}/api/${api_path}/admin/upload`,formData)
              .then((res) => {
                console.log(res);
                console.log("上傳圖片網址", res.data.imageUrl);
                this.uploadImages = res.data.imageUrl;
                alert("圖片上傳成功")
              })
              .catch((err) => {
                console.log(err.response.data.message);
              })
        
        }
    },
    mounted() {
        editProductModal = new bootstrap.Modal(document.querySelector("#editProductModal"));
        deleteProductModal = new bootstrap.Modal(document.querySelector("#deleteProductModal"));
        this.checkLogin();
        this.getProductList();
        
    },
}
createApp(app).mount('#app')