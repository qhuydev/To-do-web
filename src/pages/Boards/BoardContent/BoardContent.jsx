import React from 'react'
import Box from "@mui/material/Box"
import ListColumns from './ListColumns/ListColumns'

function BoardContent() {
  return (
    <Box sx={{
        bgcolor: (theme) =>
        theme.palette.mode === 'dark' ? '#34495e' : '#1565c0',
          width: '100%',
          height: (theme) => theme.todo.boardContentHeight,
          display: 'flex',
          overflowX: 'auto'
          
    }}>
        <ListColumns />
        

    </Box>
  )
}

export default BoardContent