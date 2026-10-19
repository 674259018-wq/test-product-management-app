import Swal from "sweetalert2";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  try {
    const response = JSON.parse(error.message);
    return response.error || response.message || error.message;
  } catch {
    return error?.message || "เกิดข้อผิดพลาดในการทำรายการ";
  }
};

const showError = (error) =>
  Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text: getErrorMessage(error),
  });

const showSuccess = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    timer: 1600,
    showConfirmButton: false,
  });

const confirmDelete = () =>
  Swal.fire({
    icon: "warning",
    title: "ยืนยันการลบวารสาร",
    text: "คุณต้องการลบวารสารนี้ใช่หรือไม่?",
    showCancelButton: true,
    confirmButtonText: "ลบวารสาร",
    cancelButtonText: "ยกเลิก",
    reverseButtons: true,
  }).then((result) => result.isConfirmed);

export { confirmDelete, showError, showSuccess };
