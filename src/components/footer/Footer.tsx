function Footer() {

    return (
        <div className="flex flex-col min-h-screen">
            <section className="relative overflow-hidden py-10 bg-gray-900 border border-t-2 border-t-black mt-auto">
                <div className="relative z-10 mx-auto max-w-7xl px-4">
                    <div className="-m-6 flex flex-wrap">
                        <p className="text-gray-50">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                            Quia officiis deserunt molestiae!
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Footer

// import { AppBar, Toolbar, Typography } from "@mui/material";

// const Footer = () => (
//   <AppBar position="static" color="primary">
//     <Toolbar>
//       <Typography variant="body2" sx={{ flexGrow: 1, textAlign: "center" }}>
//         © 2025 Your Company
//       </Typography>
//     </Toolbar>
//   </AppBar>
// );

// export default Footer;

// import { Box, Typography } from "@mui/material";

// const Footer = () => (
//   <Box component="footer" sx={{ py: 2, textAlign: "center", bgcolor: "grey.200" }}>
//     <Typography variant="body2">© 2025 Your Company</Typography>
//   </Box>
// );

// export default Footer;
