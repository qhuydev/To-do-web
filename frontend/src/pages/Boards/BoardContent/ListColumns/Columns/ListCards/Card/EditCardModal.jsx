import { useState, useEffect } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import CloseIcon from '@mui/icons-material/Close'
import ImageIcon from '@mui/icons-material/Image'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LabelIcon from '@mui/icons-material/Label'
import AddIcon from '@mui/icons-material/Add'
import Divider from '@mui/material/Divider'
import cardApi from '~/api/cardApi'
import messageApi from '~/api/messageApi'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    overflow: 'auto',
}

const coverColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788'
]

const labelColors = [
    '#FF6B6B', '#FFA500', '#FFD700', '#90EE90', '#4ECDC4',
    '#45B7D1', '#BB8FCE', '#FF69B4', '#A9A9A9', '#8B4513'
]

function EditCardModal({ open, onClose, card, onSave, mode = 'edit', receiverId }) {
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endDate, setEndDate] = useState('')
    const [endTime, setEndTime] = useState('')
    const [cover, setCover] = useState('')
    const [labels, setLabels] = useState([])
    const [isAddingLabel, setIsAddingLabel] = useState(false)
    const [newLabelTitle, setNewLabelTitle] = useState('')
    const [newLabelColor, setNewLabelColor] = useState(labelColors[0])

    useEffect(() => {
        if (card) {
            setTitle(card.title || '')

            if (card.startDate) {
                const startDateTime = new Date(card.startDate)
                setStartDate(startDateTime.toISOString().split('T')[0])
                setStartTime(startDateTime.toTimeString().slice(0, 5))
            } else if (card.createdAt) {
                const createdDateTime = new Date(card.createdAt)
                setStartDate(createdDateTime.toISOString().split('T')[0])
                setStartTime(createdDateTime.toTimeString().slice(0, 5))
            } else {
                const now = new Date()
                setStartDate(now.toISOString().split('T')[0])
                setStartTime(now.toTimeString().slice(0, 5))
            }

            if (card.dueDate) {
                const dueDateTime = new Date(card.dueDate)
                setEndDate(dueDateTime.toISOString().split('T')[0])
                setEndTime(dueDateTime.toTimeString().slice(0, 5))
            } else {
                setEndDate('')
                setEndTime('')
            }

            setCover(card.cover || '')
            setLabels(card.labels || [])
        } else {
            const now = new Date()
            setStartDate(now.toISOString().split('T')[0])
            setStartTime(now.toTimeString().slice(0, 5))
        }
    }, [card])

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Vui lòng chọn file ảnh!')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('Kích thước ảnh không được vượt quá 5MB!')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setCover(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleAddLabel = () => {
        const labelText = newLabelTitle.trim() || newLabelColor
        const newLabel = `${newLabelColor}|${labelText}`

        if (!labels.includes(newLabel)) {
            setLabels([...labels, newLabel])
        }

        setNewLabelTitle('')
        setNewLabelColor(labelColors[0])
        setIsAddingLabel(false)
    }

    const handleRemoveLabel = (labelToRemove) => {
        setLabels(labels.filter(label => label !== labelToRemove))
    }

    const parseLabelData = (label) => {
        const [color, text] = label.split('|')
        return { color, text: text || '' }
    }

    const handleSave = async () => {
        if (!title.trim()) return

        const startDateTime = startDate && startTime ? `${startDate}T${startTime}:00` : null

        let finalEndDate = endDate
        let finalEndTime = endTime

        if (endDate && !endTime) {
            finalEndTime = '00:00'
        }

        if (endTime && !endDate) {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            finalEndDate = tomorrow.toISOString().split('T')[0]
        }

        const endDateTime = finalEndDate && finalEndTime ? `${finalEndDate}T${finalEndTime}:00` : null

        if (mode === 'edit') {
            onSave({
                ...card,
                title: title.trim(),
                startDate: startDateTime,
                dueDate: endDateTime,
                cover,
                labels,
            })
        } else if (mode === 'assign') {
            try {
                const response = await cardApi.createWithoutList({
                    title: title.trim(),
                    startDate: startDateTime,
                    dueDate: endDateTime,
                    cover,
                    labels,
                })

                if (receiverId && response?.data?.id) {
                    await messageApi.sendMessage({
                        receiverId,
                        content: title.trim(),
                        type: 'CARD',
                        cardId: response.data.id,
                    })
                }

                if (onSave) {
                    onSave()
                }
            } catch (error) {
                console.error('Lỗi khi giao việc:', error)
                alert('Không thể giao việc. Vui lòng thử lại!')
                return
            }
        }
        onClose()
    }
    const handleClose = () => {
        setTitle(card?.title || '')

        if (card?.startDate) {
            const startDateTime = new Date(card.startDate)
            setStartDate(startDateTime.toISOString().split('T')[0])
            setStartTime(startDateTime.toTimeString().slice(0, 5))
        } else if (card?.createdAt) {
            const createdDateTime = new Date(card.createdAt)
            setStartDate(createdDateTime.toISOString().split('T')[0])
            setStartTime(createdDateTime.toTimeString().slice(0, 5))
        }

        if (card?.dueDate) {
            const dueDateTime = new Date(card.dueDate)
            setEndDate(dueDateTime.toISOString().split('T')[0])
            setEndTime(dueDateTime.toTimeString().slice(0, 5))
        } else {
            setEndDate('')
            setEndTime('')
        }

        setCover(card?.cover || '')
        setLabels(card?.labels || [])
        setIsAddingLabel(false)
        setNewLabelTitle('')
        setNewLabelColor(labelColors[0])
        onClose()
    }

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                {/* Header */}
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" fontWeight={600}>
                        {mode === 'assign' ? 'Giao công việc' : 'Chỉnh sửa Card'}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ p: 3 }}>
                    {/* Title */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                            Tiêu đề
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Nhập tiêu đề card..."
                            variant="outlined"
                            size="small"
                        />
                    </Box>

                    {/* Date & Time */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon fontSize="small" />
                            Thời gian
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            {/* Bắt đầu */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                    Bắt đầu
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>

                            {/* Arrow */}
                            <Box sx={{ display: 'flex', alignItems: 'center', pt: 3 }}>
                                <Typography variant="h6" color="text.secondary">→</Typography>
                            </Box>

                            {/* Kết thúc */}
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                    Kết thúc
                                </Typography>
                                <TextField
                                    fullWidth
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Labels */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LabelIcon fontSize="small" />
                            Nhãn (Labels)
                        </Typography>

                        {/* Selected Labels */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            {labels.map((label, index) => {
                                const { color, text } = parseLabelData(label)
                                return (
                                    <Chip
                                        key={index}
                                        label={text || 'Label'}
                                        onDelete={() => handleRemoveLabel(label)}
                                        sx={{
                                            bgcolor: color,
                                            color: '#fff',
                                            fontWeight: 500,
                                            '& .MuiChip-deleteIcon': {
                                                color: 'rgba(255,255,255,0.7)',
                                                '&:hover': {
                                                    color: '#fff',
                                                }
                                            }
                                        }}
                                    />
                                )
                            })}
                        </Box>

                        {/* Add Label Button */}
                        {!isAddingLabel && (
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setIsAddingLabel(true)}
                                size="small"
                            >
                                Thêm nhãn
                            </Button>
                        )}

                        {/* Add Label Form */}
                        {isAddingLabel && (
                            <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    Tiêu đề (không bắt buộc)
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={newLabelTitle}
                                    onChange={(e) => setNewLabelTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề nhãn..."
                                    sx={{ mb: 2 }}
                                />

                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    Chọn màu
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <input
                                        type="color"
                                        value={newLabelColor}
                                        onChange={(e) => setNewLabelColor(e.target.value)}
                                        style={{
                                            width: '60px',
                                            height: '40px',
                                            border: '2px solid #ddd',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            width: 120,
                                            height: 40,
                                            bgcolor: newLabelColor,
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                        }}
                                    >
                                        {newLabelTitle || 'Preview'}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleAddLabel}
                                    >
                                        Thêm
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                            setIsAddingLabel(false)
                                            setNewLabelTitle('')
                                            setNewLabelColor(labelColors[0])
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>



                    <Divider sx={{ my: 2 }} />

                    {/* Cover/Banner */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ImageIcon fontSize="small" />
                            Ảnh bìa (Banner)
                        </Typography>

                        {/* Preview */}
                        {cover && (
                            <Box
                                sx={{
                                    height: 130,
                                    borderRadius: 1,
                                    mb: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: cover.startsWith('data:') || cover.startsWith('http') ? 'transparent' : cover,
                                    backgroundImage: cover.startsWith('data:') || cover.startsWith('http') ? `url(${cover})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => setCover('')}
                                    sx={{ bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                                >
                                    Xóa ảnh bìa
                                </Button>
                            </Box>
                        )}

                        {/* Upload Image Button */}
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                            sx={{ mb: 2, width: '100%' }}
                        >
                            Tải ảnh lên từ máy
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>

                        {/* Color Picker */}
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Hoặc chọn màu:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {coverColors.map((color) => (
                                <Box
                                    key={color}
                                    onClick={() => setCover(color)}
                                    sx={{
                                        width: 48,
                                        height: 32,
                                        bgcolor: color,
                                        borderRadius: 1,
                                        cursor: 'pointer',
                                        border: cover === color ? '3px solid' : '2px solid transparent',
                                        borderColor: cover === color ? 'primary.main' : 'transparent',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: 2,
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>

                {/* Footer */}
                <Box sx={{
                    p: 2,
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'flex-end',
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Button onClick={handleClose} variant="outlined">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!title.trim()}
                    >
                        {mode === 'assign' ? 'Giao việc' : 'Lưu thay đổi'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    )
}

export default EditCardModal
