import java.util.Scanner;

public class pattern {
    public static void main(String[] arg) {
        try (Scanner scanner = new Scanner(System.in)) {

            int num = scanner.nextInt();
            int dummy_num = num;

            for (int i=num; i>0; i--) {
                int duplicate = num;
                while (duplicate > 0) {
                    for (int j=dummy_num; j>0; j--) {
                        System.out.print(duplicate);
                    }
                    duplicate -= 1;
                }
                System.out.println();
                dummy_num -= 1;
            }

        }
    }
}
