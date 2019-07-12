import React, {Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../../hoc/Aux/Aux'

const withErrorHandler = (WrappedComponent, axios)  => {
    return class extends Component {
        state = {
            error: null
        }

        componentWillMount () {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null});
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error});
            });
        }
        errorConfirmHandler =  () => {
            this.setState({error: null})
        }
        componentWillUnmount() {
            console.log('Will Unmount', this.reqInterceptor, this.resInterceptor)
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        render() {
            return (
                <Aux>
                    <Modal 
                        modalClosed={this.errorConfirmHandler}
                        show= {this.state.error}>
                        {this.state.error ? this.state.error.message: null}
                    </Modal> 
                    <WrappedComponent {...this.props}/>
                </Aux>
            );
        }
    }
}


export default withErrorHandler;