import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #fff;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
  border-radius: 8px;
`;

const Title = styled.h1`
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 40px;
  font-size: 2.5rem;
  font-weight: 600;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: #3498db;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
  padding: 20px;
  background: #fcfcfc;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 24px;
    background: #3498db;
    margin-right: 12px;
    border-radius: 2px;
  }
`;

const SubTitle = styled.h3`
  color: #34495e;
  margin: 20px 0 15px;
  font-size: 1.4rem;
  font-weight: 600;
  padding-left: 15px;
  border-left: 3px solid #3498db;
`;

const Content = styled.div`
  line-height: 1.8;
  color: #444;
  margin-bottom: 15px;
  font-size: 1rem;
  
  ul {
    padding-left: 25px;
  }
  
  li {
    margin-bottom: 12px;
  }
  
  p {
    margin-bottom: 15px;
  }
`;

const ImportantText = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-left: 4px solid #3498db;
  margin: 15px 0;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const WarningText = styled(ImportantText)`
  border-left-color: #e74c3c;
  background-color: #fff5f5;
`;

const ListItem = styled.li`
  margin-bottom: 15px;
  position: relative;
  padding-left: 20px;
  
  &:before {
    content: '•';
    color: #3498db;
    position: absolute;
    left: 0;
    font-weight: bold;
  }
`;

const ProcessStep = styled.div`
  padding: 15px 20px;
  margin: 10px 0;
  border-left: 3px solid #3498db;
  background: #f8f9fa;
  border-radius: 4px;
  
  strong {
    display: block;
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 1.1rem;
  }
`;

const Responsibilities = () => {
  return (
    <Container>
      <Title>CHÍNH SÁCH CHUNG</Title>

      <Section>
        <SectionTitle>1. GIỚI THIỆU</SectionTitle>
        <Content>
          <p>
            Chào mừng bạn đến với Camera Service Platform! Nền tảng của chúng
            tôi cung cấp một môi trường để người dùng có thể thuê, cho thuê, mua
            và bán máy ảnh, phụ kiện máy ảnh, cùng các thiết bị liên quan.
          </p>
          <ImportantText>
            BẰNG VIỆC SỬ DỤNG DỊCH VỤ HAY TẠO TÀI KHOẢN TẠI CAMERA SERVICE
            PLATFORM, BẠN ĐÃ CHẤP NHẬN VÀ ĐỒNG Ý VỚI NHỮNG ĐIỀU KHOẢN DỊCH VỤ
            NÀY VÀ CHÍNH SÁCH BỔ SUNG ĐƯỢC DẪN CHIẾU THEO ĐÂY.
          </ImportantText>
          <WarningText>
            NẾU BẠN KHÔNG ĐỒNG Ý VỚI NHỮNG ĐIỀU KHOẢN DỊCH VỤ NÀY, VUI LÒNG
            KHÔNG SỬ DỤNG DỊCH VỤ HOẶC TRUY CẬP VÀO TRANG CAMERA SERVICE
            PLATFORM.
          </WarningText>
        </Content>
      </Section>

      <Section>
        <SectionTitle>2. ĐỐI TƯỢNG ÁP DỤNG</SectionTitle>
        <Content>
          <ul>
            <ListItem>
              <strong>Nhà cung cấp:</strong> Các cá nhân hoặc doanh nghiệp có
              thiết bị máy ảnh và phụ kiện để cho thuê/bán. Nhà cung cấp bắt
              buộc phải đăng ký tài khoản, cung cấp các thông tin theo quy định
              của pháp luật và quy định của nền tảng mới được đăng cho thuê/ bán
              sản phẩm.
            </ListItem>
            <ListItem>
              <strong>Khách hàng:</strong> Các cá nhân hoặc tổ chức cần thuê/mua
              máy ảnh hoặc phụ kiện cho mục đích cá nhân hoặc công việc. Người
              thuê/mua bắt buộc đăng ký tài khoản để tham gia giao dịch.
            </ListItem>
          </ul>
        </Content>
      </Section>

      <Section>
        <SectionTitle>
          3. QUY ĐỊNH VỀ ĐĂNG TẢI THIẾT BỊ VÀ SẢN PHẨM
        </SectionTitle>
        <SubTitle>3.1. Đối với người cho thuê/ bán</SubTitle>
        <Content>
          <ul>
            <ListItem>
              Mô tả chính xác: Nhà cung cấp phải cung cấp thông tin chính xác
              tối thiểu theo yêu cầu của nền tảng.
            </ListItem>
            <ListItem>
              Chất lượng thiết bị: Nhà cung cấp có trách nhiệm đảm bảo thiết bị
              hoặc sản phẩm hoạt động tốt và không có lỗi không được báo trước.
            </ListItem>
            <ListItem>
              Giá cả: Giá thuê và giá bán phải minh bạch, rõ ràng.
            </ListItem>
          </ul>
          <ImportantText>
            Camera Service Platform sẽ kiểm duyệt thông tin sản phẩm, dịch vụ
            của Nhà cung cấp theo Chính sách đăng bán và quy định về kiểm duyệt
            của nền tảng.
          </ImportantText>
          <WarningText>
            Vi phạm: trường hợp Nhà cung cấp vi phạm Chính sách đăng bán và quy
            định về kiểm duyệt của nền tảng quá 3 lần thì khóa tài khoản vĩnh
            viễn. Nếu vi phạm 1 lần thì tài khoản sẽ bị khóa 15 ngày kể từ thời
            điểm nhận thông báo vi phạm.
          </WarningText>
        </Content>

        <SubTitle>3.2. Đối với người thuê và người mua</SubTitle>
        <Content>
          <ImportantText>
            Người thuê/mua phải kiểm tra kỹ thiết bị khi nhận hàng và thông báo
            ngay cho Nhà cung cấp nếu phát hiện vấn đề. Tiền sẽ được hoàn lại
            trong vòng 7 ngày kể từ thời điểm trả hàng.
          </ImportantText>
        </Content>
      </Section>

      <Section>
        <SectionTitle>4. CHÍNH SÁCH GIAO NHẬN HÀNG</SectionTitle>
        <Content>
          <p>
            Khi phát sinh đơn đặt hàng, hệ thống sẽ chuyển thông tin đơn hàng
            cho Nhà cung cấp để xác nhận. Sau khi đơn hàng được xác nhận, Nhà
            cung cấp sẽ chủ động liên hệ với khách hàng về hình thức giao nhận.
          </p>
        </Content>
      </Section>

      <Section>
        <SectionTitle>5. CHÍNH SÁCH BẢO HÀNH</SectionTitle>
        <Content>
          <ul>
            <ListItem>
              Nhà cung cấp có trách nhiệm tiếp nhận bảo hành sản phẩm, dịch vụ
              cho Người Mua theo cam kết trong Chính sách bảo hành.
            </ListItem>
            <ListItem>
              Người Mua có quyền yêu cầu bảo hành khi đáp ứng các điều kiện theo
              Chính sách.
            </ListItem>
            <ListItem>
              Người Mua có quyền khiếu nại nếu Người Bán từ chối bảo hành không
              phù hợp.
            </ListItem>
          </ul>
          <ImportantText>
            CameraService khuyến cáo Người Mua/Thuê hàng cần kiểm tra các chính
            sách bảo hành, bảo trì trước khi đặt hàng. CameraService không chịu
            trách nhiệm trong việc bảo hành bất kỳ sản phẩm nào.
          </ImportantText>
        </Content>
      </Section>

      <Section>
        <SectionTitle>6. QUY TRÌNH GIAO DỊCH</SectionTitle>
        <SubTitle>6.1. Đối với giao dịch thuê</SubTitle>
        <Content>
          <ProcessStep>
            <strong>Tìm kiếm và đặt thuê:</strong>
            <ul>
              <ListItem>Thời gian cho thuê: 8.00h - 20.00h</ListItem>
              <ListItem>Gia hạn: 8h - 17h cùng ngày</ListItem>
              <ListItem>Hoàn trả trong vòng 1 tiếng sau khi hết hạn</ListItem>
              <ListItem>
                Thời gian thuê:
                <ul>
                  <li>Theo giờ: 2-8 giờ</li>
                  <li>Theo ngày: 1-3 ngày</li>
                  <li>Theo tuần: 1-2 tuần</li>
                  <li>Theo tháng: 1 tháng</li>
                </ul>
              </ListItem>
            </ul>
          </ProcessStep>
          <ProcessStep>
            <strong>Thanh toán và giao nhận:</strong>
            <ul>
              <ListItem>Thanh toán tiền giữ chỗ</ListItem>
              <ListItem>Phương thức: QR, tiền mặt, chuyển khoản</ListItem>
              <ListItem>Kiểm tra và nhận máy</ListItem>
              <ListItem>Trả máy và kiểm tra trong vòng 24h</ListItem>
            </ul>
          </ProcessStep>
        </Content>

        <SubTitle>6.2. Đối với giao dịch mua bán</SubTitle>
        <Content>
          <ProcessStep>
            <ul>
              <ListItem>Tìm kiếm và xem thông tin sản phẩm</ListItem>
              <ListItem>Click "Mua ngay" và thanh toán</ListItem>
              <ListItem>Nhà cung cấp xác nhận và liên hệ giao hàng</ListItem>
            </ul>
          </ProcessStep>
        </Content>
      </Section>

      <Section>
        <SectionTitle>7. CHÍNH SÁCH ĐỔI TRẢ VÀ HOÀN TIỀN</SectionTitle>
        <Content>
          7.1. Đối với giao dịch thuê Người thuê có thể hủy thuê sản phẩm mà
          không mất phí. (Lưu ý: Được phép huỷ trong vòng 24h kể từ khi tạo đơn
          hàng và đơn hàng chưa được Nhà cung cấp phê duyệt) 7.2. Đối với giao
          dịch mua bán Người mua có quyền yêu cầu đổi trả hoặc hoàn tiền nếu sản
          phẩm không đúng mô tả, hỏng hóc hoặc lỗi kỹ thuật trong thời gian quy
          định của nền tảng. Người bán phải chấp nhận hoàn tiền theo chính sách
          của nền tảng nếu phát hiện sản phẩm có lỗi.
        </Content>
      </Section>

      <Section>
        <SectionTitle>8. QUY ĐỊNH VỀ TRÁCH NHIỆM</SectionTitle>
        <Content>
          Trách nhiệm của người mua: Người mua cần đọc kỹ mô tả sản phẩm trước
          khi đặt mua và chịu trách nhiệm về quyết định mua của mình, ngoại trừ
          trường hợp sản phẩm có lỗi hoặc không đúng mô tả. Trách nhiệm của
          người thuê: Người thuê phải chịu trách nhiệm bồi thường cho người cho
          thuê nếu thiết bị bị hỏng hóc hoặc mất mát trong quá trình sử dụng
          theo thỏa thuận của người cho thuê và người thuê.
        </Content>
      </Section>

      <Section>
        <SectionTitle>9. HUỶ GIAO DỊCH</SectionTitle>
        <Content>
          Người thuê và người mua có quyền hủy giao dịch trong các trường hợp
          được quy định bởi nền tảng, bao gồm thời gian hủy và điều kiện hủy.
          Người cho thuê và người bán có thể hủy giao dịch nếu có lý do chính
          đáng nhưng phải thông báo kịp thời cho bên đối tác.
        </Content>
      </Section>

      <Section>
        <SectionTitle>10. HÀNH VI VI PHẠM VÀ HÌNH THỨC XỬ LÝ</SectionTitle>
        <Content>
          <ImportantText>
            Nền tảng có quyền tạm ngừng hoặc chấm dứt tài khoản của người dùng
            nếu phát hiện hành vi lừa đảo, vi phạm chính sách.
          </ImportantText>
        </Content>
      </Section>

      <Section>
        <SectionTitle>11. BẢO MẬT VÀ QUYỀN RIÊNG TƯ</SectionTitle>
        <Content>
          Nền tảng cam kết bảo mật thông tin cá nhân của người dùng và chỉ sử
          dụng thông tin cho các mục đích giao dịch. Thông tin cá nhân sẽ không
          được chia sẻ cho bên thứ ba nếu không có sự đồng ý của người dùng, trừ
          trường hợp yêu cầu pháp lý.{" "}
        </Content>
      </Section>

      <Section>
        <SectionTitle>12. ĐIỀU CHỈNH VÀ SỬA ĐỔI CHÍNH SÁCH</SectionTitle>
        <Content>
          Nền tảng có quyền điều chỉnh và cập nhật các chính sách sử dụng khi
          cần thiết. Người dùng có trách nhiệm theo dõi và tuân thủ các thay đổi
          mới nhất của chính sách này.
        </Content>
      </Section>
    </Container>
  );
};

export default Responsibilities;
