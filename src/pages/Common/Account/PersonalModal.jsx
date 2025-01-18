import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react"; // Add useState
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getAccountById, updateAccount } from "../../../api/accountApi";
import { login } from "../../../redux/features/authSlice";

const validationSchema = Yup.object({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  firstName: Yup.string().required("Họ là bắt buộc"),
  lastName: Yup.string().required("Tên là bắt buộc"),
  phoneNumber: Yup.string().required("Số điện thoại là bắt buộc"),
  address: Yup.string(),
  job: Yup.number().nullable(),
  hobby: Yup.number().nullable(),
  gender: Yup.number().nullable(),
  frontOfCitizenIdentificationCard: Yup.mixed().nullable(),
  backOfCitizenIdentificationCard: Yup.mixed().nullable(),
  bankName: Yup.string().required("Tên ngân hàng là bắt buộc"),
  accountNumber: Yup.string().required("Số tài khoản là bắt buộc"),
  accountHolder: Yup.string().required("Chủ tài khoản là bắt buộc"),
});

const PersonalModal = ({ onClose }) => {
  const { user } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);

  const initialValues = {
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNumber: user?.phoneNumber || "",
    address: user?.address || "",
    job: user?.job || null,
    hobby: user?.hobby || null,
    gender: user?.gender || null,
    frontOfCitizenIdentificationCard:
      user?.frontOfCitizenIdentificationCard || null,
    backOfCitizenIdentificationCard:
      user?.backOfCitizenIdentificationCard || null,
    bankName: user?.bankName || "",
    accountNumber: user?.accountNumber || "",
    accountHolder: user?.accountHolder || "",
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-xl">
        <h3 className="font-bold text-lg mb-4">Thông tin cá nhân</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              formData.append(key, values[key]);
            });
            try {
              const data = await updateAccount(formData);
              if (data.isSuccess) {
                const userData = await getAccountById(user.id);
                if (userData.isSuccess) {
                  dispatch(login(userData.result));
                  toast.success("Cập nhật dữ liệu thành công");
                  onClose(); // Close the modal after successful update
                } else {
                  toast.error("Không thể lấy dữ liệu người dùng đã cập nhật");
                }
              } else {
                if (data.messages.length === 0) {
                  toast.error("Đã xảy ra lỗi, vui lòng thử lại sau");
                } else {
                  data.messages.forEach((item) => {
                    toast.error(item);
                  });
                }
              }
            } catch (error) {
              toast.error("Có lỗi xảy ra, vui lòng thử lại");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="flex flex-col gap-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label font-semibold">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  readOnly
                  className={`input input-bordered w-full`}
                  placeholder="Nhập email của bạn"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              {/* First and Last Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="label font-semibold">
                    Họ
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`input input-bordered w-full`}
                    placeholder="Nhập họ của bạn"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-error mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="label font-semibold">
                    Tên
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`input input-bordered w-full`}
                    placeholder="Nhập tên của bạn"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-error mt-1"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="label font-semibold">
                  Số điện thoại
                </label>
                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="Nhập số điện thoại của bạn"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              {/* Address Field */}
              {/* <div>
                <label htmlFor="address" className="label font-semibold">
                  Địa chỉ
                </label>
                <Field
                  id="address"
                  name="address"
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="Nhập địa chỉ của bạn"
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-error mt-1"
                />
              </div> */}

              {/* Job Field */}
              <div>
                <label htmlFor="job" className="label font-semibold">
                  Nghề nghiệp
                </label>
                <Field
                  id="job"
                  name="job"
                  as="select"
                  className={`input input-bordered w-full`}
                >
                  <option value="">Chọn nghề nghiệp</option>
                  <option value={0}>Học sinh</option>
                  <option value={1}>Nhiếp ảnh chuyên nghiệp</option>
                  <option value={2}>Nhiếp ảnh tự do</option>
                  <option value={3}>Người sáng tạo nội dung</option>
                  <option value={4}>Người mới bắt đầu</option>
                  <option value={5}>Sinh viên nhiếp ảnh</option>
                  <option value={6}>Người yêu thích du lịch</option>
                  <option value={7}>Người dùng thông thường</option>
                  <option value={8}>Khác</option>
                </Field>
                <ErrorMessage
                  name="job"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              {/* Hobby Field */}
              <div>
                <label htmlFor="hobby" className="label font-semibold">
                  Sở thích
                </label>
                <Field
                  id="hobby"
                  name="hobby"
                  as="select"
                  className={`input input-bordered w-full`}
                >
                  <option value="">Chọn sở thích</option>
                  <option value={0}>Chụp ảnh phong cảnh</option>
                  <option value={1}>Chụp ảnh chân dung</option>
                  <option value={2}>Chụp ảnh động vật hoang dã</option>
                  <option value={3}>Chụp ảnh đường phố</option>
                  <option value={4}>Chụp ảnh cận cảnh</option>
                  <option value={5}>Chụp ảnh thể thao</option>
                  <option value={6}>Khác</option>
                </Field>
                <ErrorMessage
                  name="hobby"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              {/* Gender Field */}
              <div>
                <label htmlFor="gender" className="label font-semibold">
                  Giới tính
                </label>
                <Field
                  id="gender"
                  name="gender"
                  as="select"
                  className={`input input-bordered w-full`}
                >
                  <option value="">Chọn giới tính</option>
                  <option value={1}>Nam</option>
                  <option value={2}>Nữ</option>
                  <option value={3}>Không cung cấp</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              {/* File Uploads for Citizen Identification Cards */}
              <div>
                <label
                  htmlFor="frontOfCitizenIdentificationCard"
                  className="label font-semibold"
                >
                  Mặt trước CCCD/CMND
                </label>
                {(frontPreview || user?.frontOfCitizenIdentificationCard) && (
                  <div className="mb-2">
                    <img
                      src={frontPreview || user.frontOfCitizenIdentificationCard}
                      alt="Mặt trước CCCD"
                      className="max-h-40 rounded-lg"
                    />
                  </div>
                )}
                <input
                  id="frontOfCitizenIdentificationCard"
                  name="frontOfCitizenIdentificationCard"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("frontOfCitizenIdentificationCard", file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFrontPreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setFrontPreview(null);
                    }
                  }}
                  className="input input-bordered w-full"
                />
                <ErrorMessage
                  name="frontOfCitizenIdentificationCard"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="backOfCitizenIdentificationCard"
                  className="label font-semibold"
                >
                  Mặt sau CCCD/CMND
                </label>
                {(backPreview || user?.backOfCitizenIdentificationCard) && (
                  <div className="mb-2">
                    <img
                      src={backPreview || user.backOfCitizenIdentificationCard}
                      alt="Mặt sau CCCD"
                      className="max-h-40 rounded-lg"
                    />
                  </div>
                )}
                <input
                  id="backOfCitizenIdentificationCard"
                  name="backOfCitizenIdentificationCard"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    setFieldValue("backOfCitizenIdentificationCard", file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBackPreview(reader.result);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      setBackPreview(null);
                    }
                  }}
                  className="input input-bordered w-full"
                />
                <ErrorMessage
                  name="backOfCitizenIdentificationCard"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              <div>
                <label htmlFor="bankName" className="label font-semibold">
                  Tên ngân hàng
                </label>
                <Field
                  id="bankName"
                  name="bankName"
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="Nhập tên ngân hàng của bạn"
                />
                <ErrorMessage
                  name="bankName"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              {/* Account Number Field */}
              <div>
                <label htmlFor="accountNumber" className="label font-semibold">
                  Số tài khoản
                </label>
                <Field
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="Nhập số tài khoản"
                />
                <ErrorMessage
                  name="accountNumber"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              {/* Account Holder Field */}
              <div>
                <label htmlFor="accountHolder" className="label font-semibold">
                  Chủ tài khoản
                </label>
                <Field
                  id="accountHolder"
                  name="accountHolder"
                  type="text"
                  className={`input input-bordered w-full`}
                  placeholder="Nhập tên chủ tài khoản"
                />
                <ErrorMessage
                  name="accountHolder"
                  component="div"
                  className="text-error mt-1"
                />
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn bg-primary text-white"
                  disabled={isSubmitting}
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onClose}
                >
                  Đóng
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PersonalModal;
