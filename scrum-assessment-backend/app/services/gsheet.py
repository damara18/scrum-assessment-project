from typing import List, Dict

import pandas as pd
from gspread import Worksheet

from app.core.config import GSHEET_COLUMNS, SECTION_GROUPS, LEVEL_CONSTANT
from app.core.gsheet import get_google_sheet_file
from app.core.utilities import flatten_list, column_to_num, get_score_category


def get_form_sheet(project_id: int):
    from app.services.project import get_project_by_id

    project = get_project_by_id(project_id)
    gsheet_file = get_google_sheet_file(project.sheet.sheet_filename)
    form_sheet = gsheet_file.worksheet("Form Responses 1")

    return form_sheet


def get_project_members(form_sheet: Worksheet):
    records = form_sheet.get("C:C")
    return flatten_list(records)[1:]


def calculate_section(sheet: Worksheet, key: str, range: List[str]) -> Dict[str, float]:
    rng = f"{range[0]}:{range[1]}" if len(range) == 2 else f"{range[0]}:{range[0]}"
    records = sheet.get(rng)
    df = pd.DataFrame(records[1:], columns=records[0])
    num_of_rows = df.shape[0]
    values_to_count = ["Ya", "Sebagian", "Tidak", "Tidak Berlaku"]

    selected_columns = df.iloc[:, :]
    counts_dict = {
        value: int((selected_columns == value).sum().sum()) for value in values_to_count
    }

    if len(range) == 2:
        num_of_questions = num_of_rows * (
            column_to_num(range[1]) - column_to_num(range[0]) + 1
        )
    else:
        num_of_questions = num_of_rows

    print(f"{key} count_dics", counts_dict)
    if (num_of_questions - counts_dict["Tidak Berlaku"]) == 0:
        return {key: 0}

    score = (
        (counts_dict["Ya"] + (0.5 * counts_dict["Sebagian"]))
        / ((num_of_questions - counts_dict["Tidak Berlaku"]))
        * 100
    )
    score = round(score, 2)

    return {key: score}


def calculate_group(sections: List[str], score_dict: Dict[str, float]) -> float:
    score = sum([score_dict[section] for section in sections]) / len(sections)
    return round(score, 2)


def calculate_level(groups: List[str], score_dict: Dict[str, dict]) -> float:
    score = sum([score_dict[group]["group_score"] for group in groups]) / len(groups)
    return round(score, 2)


def calculate_smm_score(sheet: Worksheet):
    section_scores = {}
    for key, value in GSHEET_COLUMNS.items():
        result = calculate_section(sheet, key, value)
        section_scores = {**section_scores, **result}

    group_scores_dict = {}
    group_scores_list = []
    for key, value in SECTION_GROUPS.items():
        group_scores_dict[key] = {
            "group_score": calculate_group(value, section_scores),
            "section_score": {v: section_scores[v] for v in value},
        }

        total_kpa = calculate_group(value, section_scores)
        group_scores_list.append(
            {
                "goal": key,
                "objectives": [
                    {"objective": v, "kpa": section_scores[v]} for v in value
                ],
                "totalKPA": total_kpa,
                "interpretation": get_score_category(total_kpa),
            }
        )

    level_scores = []
    for key, value in LEVEL_CONSTANT.items():
        level_score = calculate_level(value, group_scores_dict)
        interpretation = get_score_category(level_score)
        level_scores.append(
            {
                "level": key,
                "goals": value,
                "kpaRating": level_score,
                "interpretation": interpretation,
            }
        )

    return {
        "group_scores": group_scores_list,
        "level_scores": level_scores,
    }
