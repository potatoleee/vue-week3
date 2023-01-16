let editProductModal = '';
let deleteProductModal = '';

// var myModal = new bootstrap.Modal(editProductModal);//實體化
const { createApp } = Vue;

const app = {
    data() {
        return {
            //產品資料
            products:[],
            isNew : false,//判斷是否為新增or編輯
            tempData:{
                "imagesUrl":[]
            },
            uploadImages : ""
            
        }
    },
    methods: {
        //登入驗證
        checkAdmin() {
            axios.post(`${api_url}/api/user/check`)
                .then(res => {
                    //使用此api後驗證後再取得資料
                    this.getProductList();
                })
                .catch(error => {
                    alert("請先登入帳號密碼喔～不要偷懶(ゝ∀･)b 感謝你！")
                    location.href = "index.html";
                })
        },
        //取得產品列表
        getProductList() {
            axios.get(`${api_url}/api/${api_path}/admin/products`)
                .then(res => {
                    this.products = res.data.products;
                    
                })
                .catch(error => {
                    alert(error.response.data.message);
                })
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
                    
                    editProductModal.hide();
                    this.getProductList();
                })
                .catch(error => {
                    alert(error.response.data.message);
                })
            
        },
        //新增圖片
        createImage() {
            this.tempData.imagesUrl = []; //新增input欄位放入網址
            this.tempData.imagesUrl.push('');
        },
        //刪除單一產品
        deleteProduct() {
            axios.delete(`${api_url}/api/${api_path}/admin/product/${this.tempData.id}`)
                .then(res => {
                    deleteProductModal.hide();
                    this.getProductList();
                    alert("刪除成功");
                })
                .catch(error => {
                    alert(error.response.data.message);
                })
        },
        //上傳圖片API
        upload(event) {
            // 取得上傳的檔案
            const file = event.target.files[0];
            
            /* 限制檔案上傳型別 */
            let fileType = file.name.substring(file.name.lastIndexOf('.') + 1);   /* 得到檔案字尾名 */
            if (fileType !== 'jpg' && fileType !== 'JPG' && fileType !== 'png') {
                alert("上傳檔案只能是 jpg、png 格式!，請注意格式上傳呦");
                return;
            }
            const formData = new FormData();
            formData.append('file-to-upload', file)
        
            axios.post(`${api_url}/api/${api_path}/admin/upload`,formData)
              .then((res) => {
                // console.log("上傳圖片網址", res.data.imageUrl);
                this.uploadImages = res.data.imageUrl;
                alert("圖片上傳成功");
              })
              .catch((err) => {
                alert(err.response.data.message);
              })
        
        }
    },
    mounted() {
        editProductModal = new bootstrap.Modal(document.querySelector("#editProductModal")); //實體化
        deleteProductModal = new bootstrap.Modal(document.querySelector("#deleteProductModal"));//實體化

        //取出Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)week2HexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        this.checkAdmin();        
    },
}
createApp(app).mount('#app')