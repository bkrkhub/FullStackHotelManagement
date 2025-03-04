import "./AppFooter.css";

const AppFooter = () => {
    
    return(
        <footer>
            <span className = "my-footer">
                Dream Hotel  | All Rights Reserved &copy; {new Date().getFullYear()}
            </span>
        </footer>
    )
}

export default AppFooter;