/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";

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