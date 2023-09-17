import json
import os
import re

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

from answers import get_wordle_answers, write_answers_to_json

load_dotenv()


def get_todays_answer():
    url = os.getenv('ANSWERS_SOURCE_URL')
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, 'html.parser')
    
    answer_section = soup.select_one('.wordle-answer-section')
    subheading = answer_section.find(class_='subheading')
    number = int(re.search(r'\(#(\d+)\)', subheading.get_text()).group(1))
    word = answer_section.find(class_='answer').get_text(strip=True).lower()
    answer = {'number': number, 'word': word}

    return answer


def add_word_to_answers(filename, new_answer):
    # Read the JSON file and load the answers list
    with open(filename, "r") as infile:
        wordle_data = json.load(infile)
        answers = wordle_data["answers"]

    # Get new Wordle word and number values
    new_wordle_word = new_answer['word']
    new_wordle_num = new_answer['number']

    # Get last Wordle word and number values
    last_wordle_word = answers[-1]['word']
    last_wordle_number = answers[-1]['number']

    # Check that word isn't already in list
    if last_wordle_word == new_wordle_word:
        print(f'Wordle #{new_wordle_num} has already been added to the list. No changes made.')
        return
    
    # Check that new wordle number is the next number needed in list
    elif last_wordle_number+1 == new_wordle_num:
        # Add the new word to the list
        answers.append(new_answer)
        print(f'Wordle #{new_wordle_num} has been added to the word list.')

        # Write the updated list back to the JSON file
        with open(filename, "w") as outfile:
            json.dump(wordle_data, outfile, indent=2)

    # If new worlde number is not next in the list and isn't already in list, rewrite answers.json
    else:
        all_answers = get_wordle_answers()
        all_answers.append(new_answer)
        write_answers_to_json(all_answers, answers_json_path)


if __name__ == '__main__':
    # Specify the JSON file and the word you want to add
    answers_json_path = os.getenv('PYTHON_ANSWERS_JSON_PATH')
    json_filename = answers_json_path
    todays_answer = get_todays_answer()

    # Call the function to add the word to the list
    add_word_to_answers(json_filename, todays_answer)
