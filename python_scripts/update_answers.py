import json
import os

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()


def get_todays_answer():
    """
    Retrieves a list of Wordle answers from the wordfinder.yourdictionary.com website.
    
    :return: A list of Wordle answers in reverse order, from the latest to the earliest.
    :rtype: list
    """
    url = 'https://wordfinder.yourdictionary.com/wordle/answers/'
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')
    
    answer = soup.select_one('.answer').getText().strip().lower()
    return answer


def add_word_to_answers(filename, new_word):
    # Read the JSON file and load the answers list
    with open(filename, "r") as infile:
        wordle_data = json.load(infile)
        answers = wordle_data["answers"]

    # Make sure word isn't already in list
    last_word = answers[-1]
    if last_word == new_word:
        return

    # Add the new word to the list
    new_word_lowercase = new_word.lower()
    answers.append(new_word_lowercase)

    # Write the updated list back to the JSON file
    with open(filename, "w") as outfile:
        json.dump(wordle_data, outfile, indent=2)


if __name__ == '__main__':
    # Specify the JSON file and the word you want to add
    answers_json_path = os.getenv('PYTHON_ANSWERS_JSON_PATH')
    json_filename = answers_json_path
    word_to_add = get_todays_answer()

    # Call the function to add the word to the list
    add_word_to_answers(json_filename, word_to_add)
