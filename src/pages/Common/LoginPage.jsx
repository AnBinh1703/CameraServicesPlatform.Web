import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { message } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  activeAccount,
  createAccount,
  getAccountById,
  googleCallback,
  loginWithEmailPass,
  submitOTPResetPass,
} from "../../api/accountApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { auth } from "../../firebase/firebase.config";
import loginImage from "../../images/login.jpg";
import { author, login } from "../../redux/features/authSlice";
import { decode } from "../../utils/jwtUtil";
import ForgotPasswordModal from "./Account/ForgotPasswordModal";
import OtpModal from "./Account/OtpModal";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)'
    ),
});
const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ hoa")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)'
    ),
  firstName: Yup.string().required("Tên là bắt buộc"),
  lastName: Yup.string().required("Họ là bắt buộc"),
  repassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
  phoneNumber: Yup.number()
    .min(10, "Phải nhiều hơn 10 ký tự")
    .required("Số điện thoại là bắt buộc"),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalForgotPasswordVisible, setIsModalForgotPasswordVisible] =
    useState(false);
  const { user } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleOtpSubmit = async (otp) => {
    console.log("Đã gửi OTP:", otp);
    const result = await activeAccount(email, otp);
    if (result.isSuccess) {
      message.success("Xác minh thành công");
      setIsModalVisible(false);
      setIsSignUp(false);
    }
  };

  const handleForgotSubmit = async (data) => {
    console.log(data);
    const result = await submitOTPResetPass(
      data.email,
      data.recoveryCode,
      data.newPassword
    );
    if (result.isSuccess) {
      message.success("Đặt lại mật khẩu thành công!");
    } else {
      for (var i = 0; i < result.messages.length; i++) {
        message.error(result.messages[i]);
      }
    }
    setIsModalForgotPasswordVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleForgotCancel = () => {
    setIsModalForgotPasswordVisible(false);
  };
  const showOtpModal = () => {
    setIsModalVisible(true);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const userCred = await signInWithPopup(auth, googleProvider);
    console.log("userCred: ", userCred);

    if (userCred) {
      const accessToken = userCred._tokenResponse.idToken;
      console.log("Google Access Token: ", accessToken);
      var result = await googleCallback(accessToken);
      if (result.isSuccess) {
        console.log("callback: ", result);
        localStorage.setItem("accessToken", result?.result?.token);
        localStorage.setItem("refreshToken", result?.result?.refreshToken);
        var fetchAccount = await getAccountById(
          decode(localStorage.getItem("accessToken")).accountId,
          localStorage.getItem("accessToken")
        );
        dispatch(author(result.result.mainRole));
        if (fetchAccount.isSuccess) {
          const userAccount = fetchAccount.result;
          dispatch(login(userAccount));
          message.success("Đăng nhập thành công");
          navigate("/");
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <LoadingComponent isLoading={isLoading} />
      {!isSignUp ? (
        <div className="flex items-center justify-center min-h-screen bg-mint">
          <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <span className="mb-3 text-4xl font-bold">
                CAMERA SERVICE PLATFORM
              </span>
              <span className="font-light text-gray-400 mb-8">
                Bạn vui lòng nhập các thông tin chi tiết để đăng nhập
              </span>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    setIsLoading(true);
                    const data = await loginWithEmailPass(
                      values.email,
                      values.password
                    );
                    if (data.isSuccess) {
                      localStorage.setItem("accessToken", data.result.token);
                      localStorage.setItem(
                        "refreshToken",
                        data.result.refreshToken
                      );
                      var fetchAccount = await getAccountById(
                        decode(localStorage.getItem("accessToken")).accountId,
                        localStorage.getItem("accessToken")
                      );
                      dispatch(author(data?.result?.mainRole));
                      if (fetchAccount.isSuccess) {
                        const userAccount = fetchAccount.result;
                        dispatch(login(userAccount));
                        message.success("Đăng nhập thành công");
                        navigate("/");
                      }
                    } else {
                      for (var i = 0; i < data.messages.length; i++) {
                        message.error(data.messages[i]);
                        if (
                          data.messages[i] ==
                          "Tài khoản này chưa được xác thực !"
                        ) {
                          setEmail(values.email);
                          setIsModalVisible(true);
                        }
                      }
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="py-4">
                      <span className="mb-2 text-md">Email</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="email"
                        name="email"
                        prefix={<MailOutlined />}
                        placeholder="Email của bạn"
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500">{errors.email}</div>
                      )}
                    </div>
                    <div className="py-4">
                      <span className="mb-2 text-md">Mật khẩu</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="password"
                        name="password"
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu của bạn"
                      />
                      {errors.password && touched.password && (
                        <div
                          className="text-red-500"
                          style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}
                        >
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between w-full py-4  mr-24">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsModalForgotPasswordVisible(true)}
                        className=" text-md w-full block text-baseGreen italic"
                      >
                        Quên mật khẩu?
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      {/* Login Button */}
                      <button
                        type="submit"
                        className="w-full mb-4 px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition duration-200"
                        disabled={isSubmitting}
                      >
                        Đăng nhập
                      </button>

                      {/* Google Sign-In Button */}
                      <button
                        className="w-full mb-4 text-black py-2 bg-base-300 rounded-md flex items-center justify-center hover:bg-base-200 transition duration-200"
                        onClick={handleGoogleSignIn}
                      >
                        <i className="fa-brands fa-google mx-2"></i> Đăng nhập
                        với Google
                      </button>

                      {/* Sign-Up Prompt */}
                      <div className="text-center text-gray-400 mb-4">
                        Bạn chưa có tài khoản?
                        <a
                          style={{ cursor: "pointer" }}
                          className="font-bold text-black hover:text-baseGreen"
                          onClick={() => setIsSignUp(true)}
                        >
                          Đăng kí ở đây
                        </a>
                      </div>

                      {/* Register Supplier Button */}
                      <Link to="/register-supplier">
                        <button className="w-full mb-4 px-4 py-2 text-sm font-mono text-black bg-pink-400 rounded-lg hover:bg-primary-dark transition duration-500">
                          Đăng ký trở thành nhà cung cấp cùng
                          CameraServicePlatform
                        </button>
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="relative">
              <img
                src={loginImage}
                alt="img"
                className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
              />
              <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-40 backdrop-blur-sm rounded drop-shadow-lg md:block">
                <span className="text-black italic text-xl">
                  Camera Service Platform
                  <br />
                  Đem lại cho bạn trải nghiệm sản phẩm vô cùng tiện lợi.
                  <br />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center min-h-screen bg-mint">
            <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
              <div className="flex flex-col justify-center px-8 md:p-14">
                <span className="mb-3 text-4xl font-bold">
                  Chào mừng bạn trở lại
                </span>
                <span className="font-light text-gray-400 mb-2">
                  Vui lòng nhập thông tin để đăng ký tài khoản
                </span>
                <Formik
                  initialValues={{
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    repassword: "",
                    phoneNumber: "",
                    frontOfCitizenIdentificationCard: null,
                    backOfCitizenIdentificationCard: null,
                  }}
                  validationSchema={SignUpSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      setIsLoading(true);
                      const formData = new FormData();
                      formData.append("email", values.email);
                      formData.append("firstName", values.firstName);
                      formData.append("lastName", values.lastName);
                      formData.append("password", values.password);
                      formData.append("phoneNumber", values.phoneNumber);
                      formData.append("roleName", "MEMBER");
                      formData.append(
                        "frontOfCitizenIdentificationCard",
                        values.frontOfCitizenIdentificationCard
                      );
                      formData.append(
                        "backOfCitizenIdentificationCard",
                        values.backOfCitizenIdentificationCard
                      );

                      const result = await createAccount(formData);

                      console.log("Register result: ", result);
                      if (result && result.isSuccess) {
                        setEmail(values.email);
                        setIsModalVisible(true);
                        message.success(
                          "Đăng ký thành công! Vui lòng xác thực email."
                        );
                      } else {
                        console.error(
                          "Đăng ký thất bại:",
                          result?.message || "Lỗi không xác định"
                        );
                        message.error("Đăng ký thất bại. Vui lòng thử lại.");
                      }
                    } catch (error) {
                      console.error("Error signing up:", error);
                      if (error.response) {
                        message.error(
                          `Đăng ký thất bại: ${
                            error.response.data.message || "Lỗi không xác định"
                          }`
                        );
                      } else {
                        message.error(
                          "Đã xảy ra lỗi. Vui lòng thử lại sau."
                        );
                      }
                    } finally {
                      setIsLoading(false);
                      setSubmitting(false);
                    }
                  }}
                >
                  {({
                    isSubmitting,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                  }) => (
                    <Form>
                      {/* Email Field */}
                      <div className="py-2">
                        <span className="mb-2 text-md">Email</span>
                        <Field
                          className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                          type="email"
                          name="email"
                          placeholder="Nhập email của bạn"
                        />
                        {errors.email && touched.email && (
                          <div className="text-red-500">{errors.email}</div>
                        )}
                      </div>

                      {/* First and Last Name Fields */}
                      <div className="py-2 flex justify-start">
                        <div className="flex flex-col justify-between mr-5">
                          <span className="mb-2 text-md mr-6">Tên</span>
                          <Field
                            className="w-full mr-2 p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                            name="firstName"
                            placeholder="Tên của bạn"
                          />
                          {errors.firstName && touched.firstName && (
                            <div className="text-red-500">
                              {errors.firstName}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between">
                          <span className="mb-2 text-md mr-6">
                            Họ và tên đệm
                          </span>
                          <Field
                            className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                            name="lastName"
                            placeholder="Họ và tên đệm"
                          />
                          {errors.lastName && touched.lastName && (
                            <div className="text-red-500">
                              {errors.lastName}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Phone Number Field */}
                      <div className="py-2">
                        <span className="mb-2 text-md">Số điện thoại</span>
                        <Field
                          className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                          name="phoneNumber"
                          placeholder="Nhập số điện thoại của bạn"
                        />
                        {errors.phoneNumber && touched.phoneNumber && (
                          <div className="text-red-500">
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>

                      {/* Password Fields */}
                      <div className="py-2">
                        <span className="mb-2 text-md">Mật khẩu</span>
                        <Field
                          className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                          type="password"
                          name="password"
                          placeholder="Mật khẩu của bạn"
                        />
                        {errors.password && touched.password && (
                          <div className="text-red-500">{errors.password}</div>
                        )}
                      </div>
                      <div className="py-2">
                        <span className="mb-2 text-md">Nhập lại mật khẩu</span>
                        <Field
                          className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                          type="password"
                          name="repassword"
                          placeholder="Nhập lại mật khẩu"
                        />
                        {errors.repassword && touched.repassword && (
                          <div className="text-red-500">
                            {errors.repassword}
                          </div>
                        )}
                      </div>

                      {/* Front of Citizen Identification Card */}
                      <div className="py-2">
                        <span className="mb-2 text-md">Ảnh mặt trước CCCD</span>
                        <input
                          className="w-full p-2 border border-gray-300 rounded-md"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "frontOfCitizenIdentificationCard",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        {values.frontOfCitizenIdentificationCard && (
                          <img
                            src={URL.createObjectURL(
                              values.frontOfCitizenIdentificationCard
                            )}
                            alt="Front of Citizen ID Card"
                            className="my-2"
                            width={200}
                            height={200}
                          />
                        )}
                        {errors.frontOfCitizenIdentificationCard && (
                          <div className="text-red-500">
                            {errors.frontOfCitizenIdentificationCard}
                          </div>
                        )}
                      </div>

                      {/* Back of Citizen Identification Card */}
                      <div className="py-2">
                        <span className="mb-2 text-md">Ảnh mặt sau CCCD</span>
                        <input
                          className="w-full p-2 border border-gray-300 rounded-md"
                          type="file"
                          onChange={(event) => {
                            setFieldValue(
                              "backOfCitizenIdentificationCard",
                              event.currentTarget.files[0]
                            );
                          }}
                        />
                        {values.backOfCitizenIdentificationCard && (
                          <img
                            src={URL.createObjectURL(
                              values.backOfCitizenIdentificationCard
                            )}
                            alt="Back of Citizen ID Card"
                            className="my-2"
                            width={200}
                            height={200}
                          />
                        )}
                        {errors.backOfCitizenIdentificationCard && (
                          <div className="text-red-500">
                            {errors.backOfCitizenIdentificationCard}
                          </div>
                        )}
                      </div>

                      <button
                        type="submit" // Changed from htmlType to type
                        className="w-full mb-3 inline-block px-4 py-2 text-xs text-center font-semibold leading-6 text-white bg-primary hover:bg-base4 rounded-lg transition duration-200"
                        disabled={isSubmitting || isLoading} // Prevent submission while loading
                      >
                        Đăng ký tài khoản
                      </button>

                      <div className="text-center text-gray-400">
                        Tôi đã có tài khoản ?
                        <a
                          style={{ cursor: "pointer" }}
                          onClick={() => setIsSignUp(false)}
                          className="font-bold text-black hover:text-baseGreen"
                        >
                          Đăng nhập ngay
                        </a>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="relative">
                <img
                  src={loginImage}
                  alt="img"
                  className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                />
                <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded drop-shadow-lg md:block">
                  <span className="text-black italic text-xl">
                    Camera Service Platform
                    <br />
                    Đem lại cho bạn trải nghiệm sản phẩm vô cùng tiện lợi.
                    <br />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <OtpModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onOtpSubmit={handleOtpSubmit}
        email={email}
      />
      <ForgotPasswordModal
        visible={isModalForgotPasswordVisible}
        onCancel={handleForgotCancel}
        onSubmit={handleForgotSubmit}
      />
    </>
  );
};

export default LoginPage;
