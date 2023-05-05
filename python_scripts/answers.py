import json
import os

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()


def get_wordle_answers():
    """
    Retrieves a list of Wordle answers from the wordfinder.yourdictionary.com website.
    
    :return: A list of Wordle answers in reverse order, from the latest to the earliest.
    :rtype: list
    """
    url = os.getenv('ANSWERS_SOURCE_URL')
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')

    answers = []
    
    answer_elements = soup.select('tr > td > strong')
    for el in answer_elements:
        number = int(el.find_parent().find_previous_sibling().getText().strip())
        word = el.getText().strip().lower()
        answer = {'number': number, 'word': word}
        answers.append(answer)

    return answers[::-1]


def write_answers_to_json(answers, filename):
    """
    Writes a list of answers to a JSON file.

    :param answers: List of Wordle answers
    :type answers: list
    :param filename: JSON filename
    :type filename: str
    """
    wordle_data = {"answers": answers}

    with open(filename, "w") as outfile:
        json.dump(wordle_data, outfile, indent=2)


if __name__ == "__main__":
    wordle_answers = get_wordle_answers()
    answers_json_path = os.getenv('PYTHON_ANSWERS_JSON_PATH')
    write_answers_to_json(wordle_answers, answers_json_path)
