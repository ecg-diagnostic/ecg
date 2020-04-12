import os
import random
import shutil
import tqdm


class Shuffler():
    def __init__(
        self,
        source_dir: str,
        test_dir: str,
        train_dir: str,
        val_dir: str,
        test_size: float = 0.1,
        val_size: float = 0.1
    ):
        self.source_dir = source_dir
        self.test_dir = test_dir
        self.train_dir = train_dir
        self.val_dir = val_dir

        self.test_size = test_size
        self.val_size = val_size

        self.files_count = 0
        for _ in os.listdir(self.source_dir):
            self.files_count += 1

    def shuffle(self):
        os.makedirs(self.test_dir, exist_ok=True)
        os.makedirs(self.train_dir, exist_ok=True)
        os.makedirs(self.val_dir, exist_ok=True)

        test_count = int(self.files_count * self.test_size)
        val_count = int(self.files_count * self.val_size)

        file_names = list(os.listdir(self.source_dir))
        random.shuffle(file_names)

        for file_idx, file_name in enumerate(file_names):
            file_path = os.path.join(self.source_dir, file_name)
            if file_idx < test_count:
                shutil.copyfile(file_path, os.path.join(self.test_dir, file_name))
            elif file_idx < test_count + val_count:
                shutil.copyfile(file_path, os.path.join(self.val_dir, file_name))
            else:
                shutil.copyfile(file_path, os.path.join(self.train_dir, file_name))
