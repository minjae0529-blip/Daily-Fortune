package com.chunmyung.saju.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long paymentId;
    private Long userId;
    private String userName;
    private String merchantUid;
    private String productType;
    private String productName;
    private String paymentMethod;
    private String paymentMethodKr;
    private Integer amount;
    private String paymentStatus;
    private String pgTid;
    private LocalDateTime paidAt;
}
