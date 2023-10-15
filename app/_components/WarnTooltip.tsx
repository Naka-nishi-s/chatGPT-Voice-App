import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Tooltip,
  Typography
} from "@mui/material";

export const WarnTooltip = () => {
  return (
    <Tooltip
      title={
        <>
          <Typography>
            返答に10秒以上かかると、エラーになります。
          </Typography>
          <Typography>
            「一言で答えて」など、chatGPTが簡潔に質問を返すようにしてみてください。
          </Typography>
        </>
      }
    >
      <WarningAmberIcon />
    </Tooltip>
  )
}
