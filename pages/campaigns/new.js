import react, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factory from '../../ethereum/factory';
import web3 from "../../ethereum/web3";
import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        // Avoid browser from attempting submit action instantly
        event.preventDefault();

        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });

            Router.pushRoute('/')

        } catch (error) {
            this.setState({
                errorMessage: error.message
            });
        }

        this.setState({ loading: false })

    }


    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>

                {/* In error the empty string is treated as false 
                So if the string is empty is will not show up error message
                The !! is defining if the string is not empty then the error is equal to true else false */}
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimun Contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={
                                event => this.setState({ minimumContribution: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />

                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
        )
    }
}

export default CampaignNew;
