import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

export default function withBasePage<P extends {}>(ChildComponent: React.ComponentType<P>) : React.FC<P> {
    const BasePageContainer: React.FC<P> = (props : P) => {
        return (
            <div className="base-page">
                <Header />
                <ChildComponent {...props} />
                <Footer />
            </div>
        ); 
    };

    return BasePageContainer;
}