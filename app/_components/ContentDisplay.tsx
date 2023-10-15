import { Box, Typography } from "@mui/material";

const ContentDisplay = ({ content }) => {
  const codeStartIndex = content.indexOf("```");
  const codeEndIndex = content.lastIndexOf("```");

  if (codeStartIndex !== -1 && codeEndIndex !== -1) {
    const textContent = content.slice(0, codeStartIndex);
    const codeContent = content.slice(codeStartIndex + 3, codeEndIndex);

    return (
      <>
        <Typography>{textContent}</Typography>
        <Box
          component="pre"
          sx={{
            backgroundColor: "#000",
            padding: "1em",
            overflowX: "auto",
            color: "#FFF"
          }}
        >
          <code>{codeContent}</code>
        </Box>
      </>
    );
  }

  return <Typography>{content}</Typography>;
};

export default ContentDisplay;
