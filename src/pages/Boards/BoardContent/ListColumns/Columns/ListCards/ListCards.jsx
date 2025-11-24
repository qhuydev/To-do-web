import Cardd from './Card/Cardd'
import Box from "@mui/material/Box"
function ListCards() {
  return (
    <Box
        sx={{
          display: 'flex',
          overflowY: "auto",
          flexDirection: 'column',
          p: 2,
          gap: 1
        }}
      >
        <Cardd />
        <Cardd />
       
      </Box>
  )
}

export default ListCards