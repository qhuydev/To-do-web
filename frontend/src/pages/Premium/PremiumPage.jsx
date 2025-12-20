import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StarIcon from '@mui/icons-material/Star'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import TableChartIcon from '@mui/icons-material/TableChart'
import SecurityIcon from '@mui/icons-material/Security'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import SpeedIcon from '@mui/icons-material/Speed'

function PremiumPage() {
    const navigate = useNavigate()
    const [selectedPlan, setSelectedPlan] = useState('yearly')

    const plans = [
        {
            id: 'monthly',
            name: 'Premium Monthly',
            price: '99,000',
            period: '/ tháng',
            description: 'Thanh toán hàng tháng, có thể hủy bất kỳ lúc nào',
            popular: false,
            color: '#4379cfff',
        },
        {
            id: 'yearly',
            name: 'Premium Yearly',
            price: '990,000',
            period: '/ năm',
            description: 'Tiết kiệm 2 tháng - Chỉ 82,500đ/tháng',
            popular: true,
            color: '#f1b74bff',
            badge: 'TIẾT KIỆM NHẤT',
        },
        {
            id: 'lifetime',
            name: 'Premium Lifetime',
            price: '2,990,000',
            period: '/ trọn đời',
            description: 'Thanh toán một lần, sử dụng mãi mãi',
            popular: false,
            color: '#066c31ff',
        },
    ]

    const features = [
        {
            icon: <TableChartIcon sx={{ fontSize: 40, color: '#3742fa' }} />,
            title: 'Chế độ xem Bảng (Table)',
            description: 'Xem và quản lý công việc dưới dạng bảng với bộ lọc mạnh mẽ',
        },
        {
            icon: <CalendarTodayIcon sx={{ fontSize: 40, color: '#3742fa' }} />,
            title: 'Lịch biểu thời gian',
            description: 'Xem timeline công việc theo tuần với khả năng kéo thả linh hoạt',
        },
        {
            icon: <CloudUploadIcon sx={{ fontSize: 40, color: '#3742fa' }} />,
            title: 'Dung lượng không giới hạn',
            description: 'Upload file đính kèm không giới hạn dung lượng',
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40, color: '#3742fa' }} />,
            title: 'Bảo mật nâng cao',
            description: 'Mã hóa dữ liệu và sao lưu tự động hàng ngày',
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40, color: '#3742fa' }} />,
            title: 'Hiệu suất cao',
            description: 'Tốc độ xử lý nhanh hơn với số lượng board không giới hạn',
        },
        {
            icon: <SupportAgentIcon sx={{ fontSize: 40, color: '#3742fa' }} />,
            title: 'Hỗ trợ ưu tiên',
            description: 'Hỗ trợ khách hàng 24/7 với thời gian phản hồi nhanh nhất',
        },
    ]

    const handlePurchase = () => {
        alert(`Đang xử lý thanh toán cho gói ${plans.find(p => p.id === selectedPlan)?.name}`)
        // Ở đây sẽ tích hợp payment gateway
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#070712' : '#f5f6fa',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            mr: 2,
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : 'white',
                            '&:hover': {
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34495e' : '#e0e0e0',
                            },
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #3742fa 30%, #ffa502 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Nâng cấp Premium
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Mở khóa toàn bộ tính năng và trải nghiệm tốt nhất
                        </Typography>
                    </Box>
                </Box>

                {/* Pricing Cards */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {plans.map((plan) => (
                        <Grid item xs={12} md={4} key={plan.id}>
                            <Card
                                onClick={() => setSelectedPlan(plan.id)}
                                sx={{
                                    height: '400px',
                                    py: 10,
                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#585858c5' : '#ffffffff',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    border: selectedPlan === plan.id ? `3px solid ${plan.color}` : '1px solid transparent',
                                    transition: 'all 0.3s ease',
                                    //   transform: selectedPlan === plan.id ? 'scale(1.05)' : 'scale(1)',
                                    '&:hover': {
                                        // transform: 'scale(1.03)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                {plan.popular && (
                                    <Chip
                                        label={plan.badge}
                                        icon={<StarIcon />}
                                        sx={{
                                            position: 'absolute',
                                            top: 30,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            bgcolor: plan.color,
                                            color: 'white',
                                            fontWeight: 700,
                                        }}
                                    />
                                )}
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="h5" fontWeight={600} gutterBottom>
                                        {plan.name}
                                    </Typography>
                                    <Box sx={{ my: 3 }}>
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 700,
                                                color: plan.color,
                                            }}
                                        >
                                            {plan.price}đ
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {plan.period}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ minHeight: 40 }}
                                    >
                                        {plan.description}
                                    </Typography>
                                    {selectedPlan === plan.id && (
                                        <CheckCircleIcon
                                            sx={{
                                                color: plan.color,
                                                fontSize: 40,
                                                mt: 2,
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Purchase Button */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handlePurchase}
                        sx={{
                            px: 6,
                            py: 2,
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            background: `linear-gradient(45deg, ${plans.find(p => p.id === selectedPlan)?.color} 30%, ${plans.find(p => p.id === selectedPlan)?.color}dd 90%)`,
                            boxShadow: 4,
                            '&:hover': {
                                boxShadow: 8,
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Mua ngay - {plans.find(p => p.id === selectedPlan)?.name}
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        🔒 Thanh toán an toàn - Hoàn tiền trong 30 ngày
                    </Typography>
                </Box>

                {/* Features */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        textAlign="center"
                        sx={{ mb: 4 }}
                    >
                        Tính năng Premium
                    </Typography>
                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        p: 3,
                                        textAlign: 'center',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* FAQ Section */}
                <Box
                    sx={{
                        mt: 6,
                        p: 4,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : 'white',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
                        Câu hỏi thường gặp
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        {[
                            {
                                q: 'Tôi có thể hủy bất kỳ lúc nào không?',
                                a: 'Có! Bạn có thể hủy subscription bất kỳ lúc nào. Không có phí ràng buộc.',
                            },
                            {
                                q: 'Phương thức thanh toán nào được hỗ trợ?',
                                a: 'Chúng tôi hỗ trợ thẻ tín dụng, thẻ ATM nội địa, Momo, ZaloPay và chuyển khoản ngân hàng.',
                            },
                            {
                                q: 'Có hoàn tiền không?',
                                a: 'Chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày đầu tiên nếu bạn không hài lòng.',
                            },
                        ].map((item, index) => (
                            <Box key={index} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {item.q}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.a}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default PremiumPage
