export default function ({ $axios, $swal }) {
  $axios.onError((error) => {
    if (!error.response) {
      $swal({
        icon: 'error',
        title: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',
        text: 'กรุณาตรวจสอบว่าเปิด backend server ไว้แล้ว',
        confirmButtonText: 'ปิด',
        confirmButtonColor: '#2e7d32'
      })
    }
    throw error
  })
}
