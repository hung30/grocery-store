import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency"; // Giả sử bạn có hàm này
import { formatDate } from "../../utils/formatDate"; // Giả sử bạn có hàm này

const PaymentErrorPage = () => {
  const [searchParams] = useSearchParams();
  const [errorDetails, setErrorDetails] = useState({
    message: "",
    error: "",
  });
  const [transactionInfo, setTransactionInfo] = useState({});

  useEffect(() => {
    // Lấy thông tin lỗi từ query parameters
    setErrorDetails({
      message: searchParams.get("message") || "Lỗi xử lý thanh toán",
      error: searchParams.get("error") || "Không xác định",
    });

    // Trích xuất thông tin giao dịch từ URL
    const params = {
      vnp_Amount: searchParams.get("vnp_Amount") || "N/A",
      vnp_BankCode: searchParams.get("vnp_BankCode") || "N/A",
      vnp_BankTranNo: searchParams.get("vnp_BankTranNo") || "N/A",
      vnp_CardType: searchParams.get("vnp_CardType") || "N/A",
      vnp_OrderInfo: searchParams.get("vnp_OrderInfo") || "N/A",
      vnp_PayDate: searchParams.get("vnp_PayDate") || "N/A",
      vnp_ResponseCode: searchParams.get("vnp_ResponseCode") || "N/A",
      vnp_TmnCode: searchParams.get("vnp_TmnCode") || "N/A",
      vnp_TransactionNo: searchParams.get("vnp_TransactionNo") || "N/A",
      vnp_TransactionStatus: searchParams.get("vnp_TransactionStatus") || "N/A",
      vnp_TxnRef: searchParams.get("vnp_TxnRef") || "N/A",
    };

    // Format số tiền và ngày giờ
    params.vnp_Amount =
      params.vnp_Amount !== "N/A"
        ? formatCurrency(parseInt(params.vnp_Amount) / 100)
        : "N/A";
    params.vnp_PayDate =
      params.vnp_PayDate !== "N/A"
        ? formatDate(
            new Date(
              params.vnp_PayDate.replace(
                /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
                "$1-$2-$3T$4:$5:$6"
              )
            )
          )
        : "N/A";

    setTransactionInfo(params);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Lỗi Thanh Toán
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Đã xảy ra lỗi trong quá trình xử lý thanh toán của bạn.
          </p>
        </div>

        {/* Error Details */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Chi Tiết Lỗi
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Thông báo:</p>
              <p className="mt-1 text-base text-gray-900">
                {errorDetails.message}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Chi tiết:</p>
              <p className="mt-1 text-base text-gray-900">
                {errorDetails.error}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông Tin Giao Dịch
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Số tiền:</p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_Amount}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Ngân hàng:</p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_BankCode}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Mã giao dịch ngân hàng:
              </p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_BankTranNo}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Loại thẻ:</p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_CardType}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Mô tả đơn hàng:
              </p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_OrderInfo}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Thời gian thanh toán:
              </p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_PayDate}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mã Tmn:</p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_TmnCode}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Mã giao dịch VNPay:
              </p>
              <p className="mt-1 text-base text-gray-900">
                {transactionInfo.vnp_TransactionNo}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/product"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Quay lại trang sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentErrorPage;
