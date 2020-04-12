from Shuffler import Shuffler

shuffler = Shuffler(
    source_dir='TrainingSet',
    test_dir='test',
    train_dir='train',
    val_dir='val',
)
shuffler.shuffle()
