import CardContent from "@mui/material/CardContent"
import { Typography } from "@mui/material"
import Card from "@mui/material/Card"
function Cardd() {
  return (
    <Card sx={{
           cursor: 'pointer',
           boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'

        }}>
      <CardContent sx={{p: 1.5, '&:last-child': {p: 1.5}}}>
        <Typography>
          Card 01
        </Typography>
      </CardContent>
        </Card>
  )
}

export default Cardd