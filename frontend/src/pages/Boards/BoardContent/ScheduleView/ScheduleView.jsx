import { useState, useMemo } from 'react'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Chip from "@mui/material/Chip"
import CardItem from '../ListColumns/Columns/ListCards/Card/CardItem'
import { useBoardStore } from '~/stores'

function ScheduleView({ board, showSnackbar }) {
    const { updateCard } = useBoardStore()
    const [draggedCard, setDraggedCard] = useState(null)
    const [dragOverCellKey, setDragOverCellKey] = useState(null)
    const [currentWeekStart, setCurrentWeekStart] = useState(() => {
        const today = new Date()
        const day = today.getDay()
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
        return new Date(today.setDate(diff))
    })

    // Generate hours (24h format)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    // Get 7 days of the week starting from currentWeekStart
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(currentWeekStart)
            date.setDate(currentWeekStart.getDate() + i)
            return date
        })
    }, [currentWeekStart])

    // Collect all cards with dueDate
    const cardsWithDueDate = useMemo(() => {
        const cards = []
        board?.lists?.forEach((list) => {
            list.cards?.forEach((card) => {
                if (card.dueDate) {
                    cards.push({
                        ...card,
                        listTitle: list.title,
                        listId: list.id,
                    })
                }
            })
        })
        return cards
    }, [board])

    // Group cards by date and hour
    const getCardsForDateTime = (date, hour) => {
        return cardsWithDueDate.filter((card) => {
            const cardDate = new Date(card.dueDate)
            return (
                cardDate.getDate() === date.getDate() &&
                cardDate.getMonth() === date.getMonth() &&
                cardDate.getFullYear() === date.getFullYear() &&
                cardDate.getHours() === hour
            )
        })
    }

    const navigateWeek = (direction) => {
        const newDate = new Date(currentWeekStart)
        newDate.setDate(newDate.getDate() + direction * 7)
        setCurrentWeekStart(newDate)
    }

    const goToToday = () => {
        const today = new Date()
        const day = today.getDay()
        const diff = today.getDate() - day + (day === 0 ? -6 : 1)
        setCurrentWeekStart(new Date(today.setDate(diff)))
    }

    const formatDate = (date) => {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        return `${days[date.getDay()]} ${date.getDate()}/${date.getMonth() + 1}`
    }

    const isToday = (date) => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    // Handle drag and drop
    const getCellKey = (date, hour) => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${hour}`
    }

    const handleDragStart = (e, card) => {
        e.stopPropagation()
        setDraggedCard(card)
        e.dataTransfer.effectAllowed = 'move'
        // Thêm data để tracking
        e.dataTransfer.setData('cardId', card.id)
    }

    const handleDragOver = (e, date, hour) => {
        e.preventDefault()
        e.stopPropagation()
        e.dataTransfer.dropEffect = 'move'
        const cellKey = getCellKey(date, hour)
        if (dragOverCellKey !== cellKey) {
            setDragOverCellKey(cellKey)
        }
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        // Chỉ clear khi rời khỏi cell hoàn toàn
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX
        const y = e.clientY
        
        if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
            setDragOverCellKey(null)
        }
    }

    const handleDrop = async (e, date, hour) => {
        e.preventDefault()
        e.stopPropagation()
        setDragOverCellKey(null)

        if (!draggedCard) return

        // Create new due date with the dropped date and hour
        const newDueDate = new Date(date)
        newDueDate.setHours(hour, 0, 0, 0)


        // Update card with new due date
        const success = await updateCard(draggedCard.id, {
            ...draggedCard,
            dueDate: newDueDate.toISOString()
        })

        if (success) {
            showSnackbar?.('Cập nhật thời gian thành công', 'success')
        } else {
            showSnackbar?.('Cập nhật thời gian thất bại', 'error')
        }

        setDraggedCard(null)
    }

    const handleDragEnd = () => {
        setDraggedCard(null)
        setDragOverCellKey(null)
    }

    const isCellDragOver = (date, hour) => {
        if (!dragOverCellKey) return false
        return dragOverCellKey === getCellKey(date, hour)
    }

    return (
        <Box sx={{
            bgcolor: 'inherit',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* Header with week navigation */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.2)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton
                        onClick={() => navigateWeek(-1)}
                        sx={{ color: 'white' }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ color: 'white', minWidth: '200px', textAlign: 'center' }}>
                        {`Tuần ${weekDays[0].getDate()}/${weekDays[0].getMonth() + 1} - ${weekDays[6].getDate()}/${weekDays[6].getMonth() + 1}/${weekDays[6].getFullYear()}`}
                    </Typography>
                    <IconButton
                        onClick={() => navigateWeek(1)}
                        sx={{ color: 'white' }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                        label="Hôm nay"
                        onClick={goToToday}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)',
                            }
                        }}
                    />
                    <Chip
                        label={`${cardsWithDueDate.length} công việc`}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                        }}
                    />
                </Box>
            </Box>

            {/* Calendar Grid */}
            <Box sx={{
                flex: 1,
                overflow: 'auto',
                position: 'relative',
            }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: '80px repeat(7, 1fr)',
                    minWidth: 'max-content',
                }}>
                    {/* Header row with days */}
                    <Box sx={{
                        position: 'sticky',
                        top: 0,
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : board?.background || '#3742fa',
                        zIndex: 2,
                        borderBottom: '2px solid rgba(255,255,255,0.3)',
                        borderRight: '1px solid rgba(255,255,255,0.2)',
                    }} />
                    {weekDays.map((date, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                position: 'sticky',
                                top: 0,
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : board?.background || '#3742fa',
                                zIndex: 2,
                                p: 1.5,
                                borderBottom: '2px solid rgba(255,255,255,0.3)',
                                borderRight: '1px solid rgba(255,255,255,0.2)',
                                textAlign: 'center',
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: isToday(date) ? '#ffd700' : 'white',
                                    fontWeight: isToday(date) ? 700 : 600,
                                    fontSize: '0.875rem',
                                }}
                            >
                                {formatDate(date)}
                            </Typography>
                        </Box>
                    ))}

                    {/* Time slots */}
                    {hours.map((hour) => (
                        <>
                            {/* Hour label */}
                            <Box
                                key={`hour-${hour}`}
                                sx={{
                                    position: 'sticky',
                                    left: 0,
                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : board?.background || '#3742fa',
                                    zIndex: 1,
                                    p: 1,
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    borderRight: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {`${hour.toString().padStart(2, '0')}:00`}
                                </Typography>
                            </Box>

                            {/* Day cells */}
                            {weekDays.map((date, dayIdx) => {
                                const cards = getCardsForDateTime(date, hour)
                                const isDraggedOver = isCellDragOver(date, hour)
                                return (
                                    <Box
                                        key={`${hour}-${dayIdx}`}
                                        onDragOver={(e) => handleDragOver(e, date, hour)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, date, hour)}
                                        sx={{
                                            minHeight: '60px',
                                            p: 0.5,
                                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                                            borderRight: '1px solid rgba(255,255,255,0.1)',
                                            bgcolor: isDraggedOver 
                                                ? 'rgba(33, 150, 243, 0.3)' 
                                                : isToday(date) 
                                                    ? 'rgba(255, 215, 0, 0.05)' 
                                                    : 'transparent',
                                            '&:hover': {
                                                bgcolor: isDraggedOver 
                                                    ? 'rgba(33, 150, 243, 0.3)' 
                                                    : 'rgba(255,255,255,0.05)',
                                            },
                                            transition: 'background-color 0.2s ease',
                                            cursor: draggedCard ? 'copy' : 'default',
                                            border: isDraggedOver ? '2px solid #2196f3' : undefined,
                                            boxSizing: 'border-box',
                                        }}
                                    >
                                        {cards.map((card) => (
                                            <CardItem
                                                key={card.id}
                                                card={card}
                                                showSnackbar={showSnackbar}
                                                disableDndKit={true}
                                                onCardDragStart={(e) => handleDragStart(e, card)}
                                                onCardDragEnd={handleDragEnd}
                                            />
                                        ))}
                                    </Box>
                                )
                            })}
                        </>
                    ))}
                </Box>
            </Box>
        </Box>
    )
}

export default ScheduleView
