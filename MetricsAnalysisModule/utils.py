from progress.bar import Bar
import os
from humanfriendly import format_timespan


class SlowBar(Bar):
    suffix = '%(percent).1f%% | %(index)d / %(max)d | %(remaining_hours)s remaining'

    @property
    def remaining_hours(self):
        return format_timespan(self.eta)


def get_repositories_path(projectName, data_dir):
    return os.path.join(*data_dir.split("/"), projectName, "Repositories")


def get_refspec(projectName, output_dir):
    filename = projectName + "-refspec.json"
    return os.path.join(*output_dir.split("/"),projectName, filename)


def get_repo_clone_list_name(projectName, output_dir):
    filename = projectName + "-repositories-to-clone.txt"
    return os.path.join(*output_dir.split("/"),projectName, filename)


def get_changes_list_and_commit(projectName, output_dir):
    filename = projectName + "-changes-commit-and-fetch.json"
    return os.path.join(*output_dir.split("/"), projectName, filename)


