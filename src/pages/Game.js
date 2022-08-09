import React from 'react';
import PropTypes from 'prop-types';
import { apiTrivia } from '../service/apiTrivia';
import Header from '../components/Header';

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      resultsTriviaApi: [],
      indexQuestion: 0,
      newArray: [],
      clickAnswer: false,
      timer: 30,
      isDisable: false,
    };
  }

  componentDidMount() {
    this.getTriviaApi();
    this.setQuestionTimer();
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.timer === 0) {
      clearInterval(this.timerInterval);
      this.setState({
        isDisable: true,
        timer: 0,
      });
    }
  }

  setQuestionTimer = () => {
    const oneSecond = 1000;
    this.timerInterval = setInterval(() => {
      this.setState((prevState) => ({
        timer: prevState.timer - 1,
      }));
    }, oneSecond);
  }

  getTriviaApi = async () => {
    const numberRandom = 0.5;
    const { indexQuestion } = this.state;
    const { history: { push } } = this.props;
    const returnTriviaApi = await apiTrivia();
    if (returnTriviaApi) {
      this.setState({
        resultsTriviaApi: returnTriviaApi,
        newArray: [returnTriviaApi[indexQuestion].correct_answer,
          ...returnTriviaApi[indexQuestion].incorrect_answers]
          .sort(() => Math.random() - numberRandom),
      });
    } else {
      push('/');
    }
  }

  getDataTestIdAnswers = (answer) => {
    const { resultsTriviaApi, indexQuestion } = this.state;
    if (answer === resultsTriviaApi[indexQuestion].correct_answer) {
      return 'correct-answer';
    }
    const wrongAnswer = resultsTriviaApi[indexQuestion].incorrect_answers
      .findIndex((el) => el === answer);
    return `wrong-answer-${wrongAnswer}`;
  }

  answerChosen = () => {
    this.setState({
      clickAnswer: true,
    });
  }

  altClassNames = (element) => {
    const { resultsTriviaApi, indexQuestion } = this.state;
    if (element === resultsTriviaApi[indexQuestion].correct_answer) {
      return 'correct-answer';
    }
    return 'incorrect-answer';
  }

  render() {
    const {
      resultsTriviaApi,
      indexQuestion,
      newArray,
      clickAnswer,
      timer,
      isDisable } = this.state;
    return (
      <div>
        <Header />
        <main>
          <h3>
            {timer}
          </h3>
          { resultsTriviaApi.length > 0
        && (
          <section>
            <h1 data-testid="question-category">
              {
                `Category: ${resultsTriviaApi[indexQuestion].category}`
              }
            </h1>
            <h2 data-testid="question-text">
              { resultsTriviaApi[indexQuestion].question }
            </h2>
            <div data-testid="answer-options">
              { newArray.map((element, index) => (
                <button
                  key={ index }
                  type="button"
                  data-testid={ this.getDataTestIdAnswers(element) }
                  onClick={ this.answerChosen }
                  disabled={ isDisable }
                  className={
                    clickAnswer ? this.altClassNames(element) : ''
                  }
                >
                  {element}
                </button>
              )) }
            </div>
          </section>
        )}
        </main>
      </div>
    );
  }
}

Game.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Game;
