import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Jumbotron, Button, Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption  } from 'reactstrap';
import {GOTO} from "../../constants/actionTypes";
import './Home.css';

const mapDispatchToProps = dispatch => ({
    onGoTo: (payload) =>
        dispatch({ type: GOTO, payload })
});

const items = [
    {
        id: 1,
        altText: 'Slide 1',
        caption: 'Bruce T.',
        text: 'Physiotherapist',
        quote: 'Life is so much better now! Really.'
    },
    {
        id: 2,
        altText: 'Slide 2',
        caption: 'Claudia S.',
        text: 'Occupational Therapist',
        quote: 'It`s fun!'
    },
    {
        id: 3,
        altText: 'Slide 3',
        caption: 'Michael T.',
        text: 'Osteopath',
        quote: 'I use it every day!'
    }
];

class Disclaimer extends Component {
    constructor(props) {
        super(props);
        this.state = { activeIndex: 0 };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.goToIndex = this.goToIndex.bind(this);
        this.onExiting = this.onExiting.bind(this);
        this.onExited = this.onExited.bind(this);
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }


    render() {
        const {activeIndex} = this.state;

        const slides = items.map((item) => {
            return (
                <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={item.id}
                    src=""
                >
                    <div className="custom-tag">"{item.quote}"</div>
                    <CarouselCaption captionText={item.text} captionHeader={item.caption} />
                </CarouselItem>
            );
        });

        return (
            <div className="container main">
                <Jumbotron>
                    <h1 className="display-3">Create your ICF-Report!</h1>
                    <p className="lead">Manage patients, reports and ICF-Core-Sets. Save your report
                        online or generate a Pdf. Make ICF documentation part of your daily work as a therapist
                        - Become more professional.</p>
                    <hr className="my-2"/>
                    <p>No sensitive data has to be saved on the server.</p>
                    <p className="lead">
                        <Button color="primary" onClick={() => this.props.onGoTo('/register')}>Sign up</Button>
                    </p>
                </Jumbotron>
                <Carousel
                    activeIndex={activeIndex}
                    next={this.next}
                    previous={this.previous}
                >
                    <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                </Carousel>
            </div>
        )
    }
}

export default connect(() => ({}), mapDispatchToProps)(Disclaimer);